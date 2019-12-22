<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\UserCity;
use App\Helpers\PopulationHelper;
use App\Helpers\CityHelper;
use App\Helpers\MovementHelper;

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
        $response['population_max'] = $data->population;
        $response['population'] = $data->population - ($data->worker_forest + $data->worker_mine + $data->scientists);
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

}
