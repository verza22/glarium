<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CityPopulation;
use App\Models\UserCity;
use App\Models\Research;
use App\Models\UserResearch;
use App\Models\UserResource;
use App\Models\Message;
use App\Models\City;
use App\User;
use App\Helpers\UserResourceHelper;
use App\Helpers\CombatHelper;
use App\Events\UserNotification;
use App\Models\Mayor;
use App\Helpers\CityHelper;
use Carbon\Carbon;
use Auth;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getUserResources()
    {
        UserResourceHelper::updateResources();
        //Obtenemos el total de investigadores
        $cities = UserCity::where('user_id',Auth::id())->pluck('city_id');
        $total_scientists = CityPopulation::whereIn('city_id',$cities)->sum('scientists');
        $data = Auth::user()->resources->only(['gold','trade_ship','trade_ship_available','research_point']);
        $data['total_scientists'] = intval($total_scientists);
        return $data;
    }

    public function config()
    {
        //Devuelve las configuraciones del juego
        $data['world'] = config('world');
        $data['research'] = Research::select(['id','research_category_id as category_id','level','cost'])->get();
        $data['user_research'] = UserResearch::where('user_id',Auth::id())->pluck('research_id');
        return $data;
    }

    public function buyTradeShip()
    {
        UserResourceHelper::updateResources();
        $userResource = UserResource::where('user_id',Auth::id())->first();

        if($userResource->trade_ship==200)
        {
            return 'Alcanzaste el limite maximo de barcos';
        }

        $level = $userResource->trade_ship + 1;
        if($level<10)
        {
            $goldCost = $level*490;
        }
        else
        {
            $coeficiente = ($level/1000)+1.8;
            $goldCost = floor(pow($level,$coeficiente)*(80+($level/10)));
        }

        if($goldCost>$userResource->gold)
        {
            return 'No tienes suficiente oro';
        }

        $userResource->gold -= $goldCost;
        $userResource->trade_ship += 1;
        $userResource->trade_ship_available += 1;
        $userResource->save();

        return 'ok';
    }

    public function sendMessage(Request $request,City $city)
    {
        $request->validate([
            'city_from' => 'required|integer|min:1',
            'message' => 'required|string|max:1500'
        ]);

        $city_from = City::whereId($request->input('city_from'))->firstOrFail();
        $this->authorize('isMyCity',$city_from);

        $cities = CityHelper::myCities();
        //Obtenemos el total de mensajes enviados en los ultimos x segundos
        $msgs = Message::whereIn('city_from',$cities)
                ->whereNull('deleted_at_from')
                ->where('created_at','>',Carbon::now()->subSeconds(config('world.messages.time')))
                ->get();

        if($msgs->count()>=config('world.messages.cant'))
        {
            $time_wait = config('world.messages.time') - Carbon::parse($msgs->first()->created_at)->diffInSeconds(Carbon::now());
            $response = 'Está permitido mandar hasta '.config('world.messages.cant');
            $response .= ' mensajes en '.config('world.messages.time').'s.';
            $response .= ' Debes esperar '.$time_wait.'s, antes de poder enviar más mensajes.';
            return $response;
        }

        $message = new Message();
        $message->city_from = $city_from->id;
        $message->city_to = $city->id;
        $message->message = $request->input('message');
        $message->save();

        event(new UserNotification('advisors','diplomat',$city->userCity->user->id));

        return 'ok';
    }

    public function getMessages(Request $request)
    {
        $request->validate([
            'type' => 'required|integer|min:0|max:1',
            'page' => 'required|integer|min:0|max:999'
        ]);
        $page = $request->input('page');
        $type = $request->input('type');
        //Obtenemos el total de mensajes leidos y no leidos
        $cities = CityHelper::myCities();

        $data['totalNoReaded'] = Message::whereIn('city_to',$cities)->whereNull('deleted_at_to')->where('readed',0)->count();
        $data['totalReaded'] = Message::whereIn('city_to',$cities)->whereNull('deleted_at_to')->where('readed',1)->count();
        $data['totalSended'] = Message::whereIn('city_from',$cities)->whereNull('deleted_at_from')->count();
        if($type==0)
        {
            $received = Message::whereIn('city_to',$cities)->whereNull('deleted_at_to')->orderBy('id','desc')->paginate(10);
            $data['more'] = $received->hasMorePages();
            $data['received'] =  $received->map(function($message){
                return [
                    'id' => $message->id,
                    'date' => Carbon::parse($message->created_at)->format('Y-m-d H:i:s'),
                    'user' => $message->from->userCity->user->only(['id','name']),
                    'readed' => $message->readed,
                    'city_name' => $message->to->name,
                    'message' => $message->message
                ];
            });
        }
        else
        {
            $sended = Message::whereIn('city_from',$cities)->whereNull('deleted_at_from')->orderBy('id','desc')->paginate(10);
            $data['more'] = $sended->hasMorePages();
            $data['sended'] = $sended->map(function($message){
                return [
                    'id' => $message->id,
                    'date' => Carbon::parse($message->created_at)->format('Y-m-d H:i:s'),
                    'user' => $message->to->userCity->user->only(['id','name']),
                    'city_name' => $message->to->name,
                    'message' => $message->message
                ];
            });
        }
        $data['page'] = $page;
        return $data;
    }

    public function getMessageUnread()
    {
        $cities = CityHelper::myCities();
        return Message::whereIn('city_to',$cities)->whereNull('deleted_at_to')->where('readed',0)->count();
    }

    public function deleteMessage(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*' => 'integer',
            'type' => 'required|boolean'
        ]);

        $cities = CityHelper::myCities();
        $type = $request->input('type') ? 'city_from' : 'city_to';
        $delete = $request->input('type') ? 'deleted_at_from' : 'deleted_at_to';
        Message::whereIn($type,$cities)->whereIn('id',$request->input('messages'))->update([$delete => Carbon::now()]);
        return 'ok';
    }

    public function getMayor()
    {
        $cities = UserCity::where('user_id',Auth::id())->pluck('city_id');
        return Mayor::whereIn('city_id',$cities)->orderBy('id','desc')->get()->map(function ($mayor){
            return [
                'fecha' => Carbon::parse($mayor->created_at)->format('Y-m-d H:i'),
                'city_id' => $mayor->city_id,
                'city_name' => $mayor->city->name,
                'type' => $mayor->type,
                'data' => $mayor->data
            ];
        });
    }

    public function readMessage(Message $message)
    {
        $this->authorize('isMyCity',$message->to);
        $message->readed = 1;
        $message->save();
        return 'ok';
    }

    public function readMessages(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*' => 'integer'
        ]);

        $cities = CityHelper::myCities();
        Message::whereIn('city_to',$cities)->whereIn('id',$request->input('messages'))->update(['readed' => 1]);
        return 'ok';
    }
}
