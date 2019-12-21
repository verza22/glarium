<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\CityPopulation;
use App\Helpers\PopulationHelper;
use App\Helpers\CityHelper;

class CityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getResources(City $city)
    {
        //Return his city
        $this->authorize('isMyCity',$city);

        $cityPopulation = CityPopulation::where('city_id',$city->id)->first();

        //Actualizamos toda la ciudad
        CityHelper::updateResources($city);

        //Actualizamos la poblacion
        PopulationHelper::satisfaction($cityPopulation,false);

        $data = $city->only(['id','wood','wine','marble','glass','sulfur']);
        $data['population'] = $city->population->only(['population_max','population']);
        $data['island_id'] = $city->islandCity->island_id;

        return $data;
    }

}
