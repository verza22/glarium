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
        $this->middleware('auth');
    }

    public function getPopulation(City $city)
    {
        $this->authorize('isMyCity',$city);
        PopulationHelper::satisfaction($city->population,false);
        return $city->population->only(['population_max','population']);
    }

    public function getResources(City $city)
    {
        $this->authorize('isMyCity',$city);
        CityHelper::updateResources($city);
        return $city->only(['wood','wine','marble','glass','sulfur']);
    }

}
