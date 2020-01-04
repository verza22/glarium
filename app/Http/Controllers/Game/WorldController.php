<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use App\Models\Island;
use Illuminate\Http\Request;

class WorldController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index($x,$y)
    {
        $n = 10;
        return Island::whereBetween('x',[$x-$n,$x+$n])->whereBetween('y',[$y-$n,$y+$n])->select(['id','name','x','y','type'])->get();
    }
}
