<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\UserCity;
use App\Models\CityPopulation;
use App\Helpers\PopulationHelper;
use App\Helpers\CityHelper;
use App\Helpers\MovementHelper;
use App\Helpers\UserResourceHelper;

use Auth;

class CityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getCities()
    {
        return UserCity::where('user_id',Auth::id())->get()->map(function($userCity){
            return [
                'id' => $userCity->city_id,
                'name' => $userCity->city->name,
                'island_id' => $userCity->city->islandCity->island->id,
                'x' => $userCity->city->islandCity->island->x,
                'y' => $userCity->city->islandCity->island->y,
                'type' => $userCity->city->islandCity->island->type
            ];
        });
    }

    public function getPopulation(City $city)
    {
        $this->authorize('isMyCity',$city);
        PopulationHelper::satisfaction($city->population,false);
        $data = $city->population;
        $response['population_max'] = $data->population_max;
        $response['population'] = $data->population;
        $response['worker_forest'] = $data->worker_forest;
        $response['worker_mine'] = $data->worker_mine;
        $response['scientists_max'] = $data->scientists_max;
        $response['scientists'] = $data->scientists;
        return $response;
    }

    public function getActionPoint(City $city)
    {
        $data['point_max'] = $city->apoint;
        $data['point']  = $city->apoint - MovementHelper::getActionPoint($city);
        return $data;
    }

    public function getResources(City $city)
    {
        $this->authorize('isMyCity',$city);
        CityHelper::updateResources($city);
        return $city->only(['wood','wine','marble','glass','sulfur']);
    }

    public function setScientists(Request $request,City $city)
    {
        $this->authorize('isMyCity',$city);
        $request->validate(['scientists' => 'required|numeric|min:0']);

        $scientists = $request->input('scientists');
        $cityPopulation = CityPopulation::where('city_id',$city->id)->first();

        if($scientists>$cityPopulation->scientists_max)
        {
            return 'No puedes poner mas investigadores de lo que permite tu academia';
        }

        PopulationHelper::satisfaction($cityPopulation);

        $scientists_diff = $scientists - $cityPopulation['scientists'];

        if( $scientists_diff > $cityPopulation->population )
        {
            return 'No puedes asignar mas investigadores de los ciudadanos que tienes';
        }

        UserResourceHelper::updateResources();

        $cityPopulation->population -= $scientists_diff;
        $cityPopulation->scientists = $scientists;

        $cityPopulation->save();
        

        return 'ok';
    }
}
