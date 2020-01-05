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
use App\User;
use App\Helpers\UserResourceHelper;
use App\Helpers\CombatHelper;
use App\Events\UserNotification;
use App\Models\Mayor;
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

    public function sendMessage(Request $request,User $user)
    {
        $request->validate([
            'message' => 'required|string|max:1500'
        ]);

        $message = new Message();
        $message->user_from = Auth::id();
        $message->user_to = $user->id;
        $message->message = $request->input('message');
        $message->save();

        event(new UserNotification('advisors','diplomat',$user->id));

        return 'ok';
    }

    public function getMessage()
    {
        //Obtenemos el total de mensajes leidos y no leidos
        $data['totalNoReaded'] = Message::where('user_to',Auth::id())->whereNull('deleted_at_to')->where('readed',0)->count();
        $data['totalReaded'] = Message::where('user_to',Auth::id())->whereNull('deleted_at_to')->where('readed',1)->count();
        $data['received'] = Message::where('user_to',Auth::id())->whereNull('deleted_at_to')->orderBy('id','desc')
        ->get()->map(function($message){
            return [
                'id' => $message->id,
                'date' => Carbon::parse($message->created_at)->format('Y-m-d H:i:s'),
                'user' => $message->from->only(['id','name']),
                'readed' => $message->readed,
                'message' => $message->message
            ];
        });
        $data['totalSended'] = Message::where('user_from',Auth::id())->whereNull('deleted_at_from')->count();
        $data['sended'] = Message::where('user_from',Auth::id())->whereNull('deleted_at_from')->orderBy('id','desc')
        ->get()->map(function($message){
            return [
                'id' => $message->id,
                'date' => Carbon::parse($message->created_at)->format('Y-m-d H:i:s'),
                'user' => $message->to->only(['id','name']),
                'message' => $message->message
            ];
        });
        return $data;
    }

    public function deleteMessage(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*' => 'integer',
            'type' => 'required|boolean'
        ]);

        $type = $request->input('type') ? 'user_from' : 'user_to';
        $delete = $request->input('type') ? 'deleted_at_from' : 'deleted_at_to';
        Message::where($type,Auth::id())->whereIn('id',$request->input('messages'))->update([$delete => Carbon::now()]);
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

        Message::where('user_to',Auth::id())->whereIn('id',$request->input('messages'))->update(['readed' => 1]);
        return 'ok';
    }
}
