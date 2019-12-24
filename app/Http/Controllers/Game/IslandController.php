<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Island;
use App\Models\UserCity;
use App\Models\Forest;
use App\Models\Mine;
use App\Models\City;
use App\Models\CityPopulation;
use App\Models\IslandCity;
use App\Helpers\BuildingHelper;
use App\Helpers\CityHelper;
use App\Helpers\PopulationHelper;
use App\Helpers\UserResourceHelper;
use Auth;

class IslandController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    public function show(Island $island)
    {
        $cities = UserCity::where('user_id',Auth::id())->pluck('city_id');
        $data = $island->only(['id','x','y','name','type']);
        $data['level_forest'] = $island->forest->level;
        $data['level_mine'] = $island->mine->level;
        $data['cities'] = $island->cities->map(function($insland_city) use($cities) {
            $data = $insland_city->only(['id','city_id','position']);
            $data['name'] = $insland_city->city->name;
            $data['type'] = $cities->contains($insland_city->city->id);
            return $data;
        });
        return $data;
    }

    public function donation(Request $request,Island $island)
    {
        $request->validate(['type' => 'required|boolean']);
        if($request->input('type'))
        {
            $donations = $island->donation_forest;
            $workers = 'worker_forest';
            $tipo = 'donated_forest';
            $data['info']['level'] = $island->forest->level;
            $data['info']['workers'] = $island->forest->workers;
            $next = Forest::where('level',($island->forest->level+1))->first();
        }
        else
        {
            $donations = $island->donation_mine;
            $workers = 'worker_mine';
            $tipo = 'donated_mine';
            $data['info']['level'] = $island->mine->level;
            $data['info']['required'] = $island->mine->level;
            $data['info']['workers'] = $island->mine->workers;
            $next = Mine::where('level',($island->mine->level+1))->first();
        }

        //Obtenemos informacion de el bosque o mina
        $data['info'][$tipo] = $island[$tipo];
        $data['info']['required_wood'] =$next->wood;
        $data['info']['required_time'] =$next->time;

        //Obtenemos la informacion detallada de las donaciones
        $data['donations'] = $donations->map(function($city_donation) use($workers) {
            $building_level = BuildingHelper::building($city_donation->city,1)->building_level;
            $data['user'] = $city_donation->city->userCity->user->name;
            $data['city'] = $city_donation->city->name;
            $data['level'] = $building_level->level;
            $data['workers'] = $city_donation->city->population[$workers];
            $data['donated'] = $city_donation->donated;
            return array_values($data);
        });

        return $data;
    }

    public function setWorker(Request $request,City $city)
    {
        $this->authorize('isMyCity',$city);
        $request->validate(['workers' => 'required|numeric|min:0','type' => 'required|boolean']);

        if($request->input('type'))
        {
            //Asigna trabajadores al aserradero
            $type = 'forest';
            $type_workers = 'worker_forest';
        }
        else
        {
            //Asigna trabajadores a la mina
            $type = 'mine';
            $type_workers = 'worker_mine';
        }

        $workers = $request->input('workers');
        $cityPopulation = CityPopulation::where('city_id',$city->id)->first();

        //Obtenemos la isla de la ciudad
        $islandCity = IslandCity::where('city_id',$city->id)->first();
        if( $workers > $islandCity->island[$type]->workers )
        {
            //Error No puedes asignar mas de lo que esta ampliado
            return 'No puedes asignar mas trabajadores de lo que permite la isla';
        }

        PopulationHelper::satisfaction($cityPopulation);

        $workers_diff = $workers - $cityPopulation[$type_workers];

        if( $workers_diff > $cityPopulation->population )
        {
            return 'No puedes asignar mas trabajadores de los ciudadanos que tienes';
        }

        $cityPopulation->population -= $workers_diff;
        $cityPopulation[$type_workers] = $workers;

        CityHelper::updateResources($city);
        $cityPopulation->save();
        UserResourceHelper::updateResources();

        return 'ok';
    }
}
