<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use App\Models\Island;
use Illuminate\Http\Request;
use DB;

class WorldController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index($x,$y)
    {
        $n = 10;
        return DB::table('island as i')->whereBetween('i.x',[$x-$n,$x+$n])
                ->whereBetween('y',[$y-$n,$y+$n])
                ->leftJoin('island_city as ic','ic.island_id','=','i.id')
                ->leftJoin('city as c','c.id','=','ic.city_id')
                ->whereNull('c.deleted_at')
                ->groupBy('i.id')
                ->selectRaw('i.id,i.name,i.x,i.y,i.type,count(ic.id) as cities')->get();
    }
}
