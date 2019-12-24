<?php

namespace App\Helpers;

use App\Models\Island;
use App\Models\Forest;
use Carbon\Carbon;
 
class IslandHelper {

    public static function checkUpgrades(Island $island) 
    {
        //Verifica si hay mejoras de bosque o mina
        if($island->forest_constructed_at != NULL){
            //Mejoramos bosque
            $nextLevel = Forest::where('level',($island->forest->level+1))->first();
            $island->donated_forest = 0;
            $island->forest_id = $nextLevel->id;
            $island->forest_constructed_at = NULL;
            $island->save();
            $island->refresh();
        }
        if($island->mine_constructed_at != NULL){
            //Mejoramos mina
            $nextLevel = Mine::where('level',($island->mine->level+1))->first();
            $island->donated_mine = 0;
            $island->mine_id = $nextLevel->id;
            $island->mine_constructed_at = NULL;
            $island->save();
            $island->refresh();
        }
    }

}