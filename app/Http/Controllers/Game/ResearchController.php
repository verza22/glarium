<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Research;
use App\Models\UserResearch;
use App\Models\UserResource;
use App\Models\UserCity;
use App\Models\CityPopulation;
use App\Helpers\UserResourceHelper;
use Auth;

class ResearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getData()
    {
        $data['research'] = Research::select(['id','research_category_id as category_id','level','cost'])->get();
        $data['user_research'] = UserResearch::where('user_id',Auth::id())->pluck('research_id');
        return $data;
    }

    public function create(Research $research)
    {
        //Si es el nivel es mayor a uno verificamos que haya investigado el nivel anterior
        if($research->level>1)
        {
            $research_back = Research::where('research_category_id',$research->research_category_id)->where('level',$research->level-1)->first();
            if(!UserResearch::where('user_id',Auth::id())->where('research_id',$research_back->id)->exists())
            {
                return 'Primero debes investigar el nivel anterior';
            }
        }

        //Verificamos que no haya investigado esto antes
        if(UserResearch::where('user_id',Auth::id())->where('research_id',$research->id)->exists())
        {
            return 'Ya tienes esta investigacion';
        }

        //Actualizamos los PI
        UserResourceHelper::updateResources();

        //Verificamos que el usuario tenga los PI necesarios
        $userResource = UserResource::where('user_id',Auth::id())->first();
        if($research->cost > $userResource->research_point)
        {
            return 'No tienes los PI suficientes para investigar esto';
        }

        //Quitamos los PI que cuesta la investigacion
        $userResource->research_point -= $research->cost;
        $userResource->save();

        //Ingresamos la investigacion
        UserResearch::create(['user_id' => Auth::id(),'research_id' => $research->id]);

        //Si la investigacion es Holiday o Well Digging	asiganamos mas espacios a las ciudades
        switch($research->name)
        {
            case 'Holiday':
                $cities_id = UserCity::where('user_id',Auth::id())->select('city_id')->pluck('city_id');
                CityPopulation::whereIn('city_id',$cities_id)->increment('population_max',50);
            break;
            case 'Well Digging':
                $userCity = UserCity::where('user_id',Auth::id())->where('capital',1)->first();
                $cityPopulation = $userCity->city->population;
                $cityPopulation->population_max += 50;
                $cityPopulation->save();
            break;
        }

        return 'ok';
    }
}
