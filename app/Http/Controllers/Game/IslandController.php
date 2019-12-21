<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Island;
use App\Models\UserCity;
use Auth;

class IslandController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function show(Island $island)
    {
        $cities = UserCity::where('user_id',Auth::id())->pluck('city_id');
        $data = $island->only(['id','x','y','name','type','donated_forest','donated_mine']);
        $data['cities'] = $island->cities->map(function($insland_city) use($cities) {
            $data = $insland_city->only(['id','city_id','position']);
            $data['name'] = $insland_city->city->name;
            $data['type'] = $cities->contains($insland_city->city->id);
            return $data;
        });
        return $data;
    }
}
