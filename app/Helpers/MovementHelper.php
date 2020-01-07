<?php

namespace App\Helpers;

use App\Models\City;
use App\Models\Movement;
use App\Models\UserResource;
use App\Models\Island;
use App\Helpers\OtherHelper;
use App\Helpers\BuildingHelper;
use App\Events\UserNotification;
use App\Models\Mayor;
use App\Models\UserCity;
use App\User;
use Auth;
use Carbon\Carbon;

class MovementHelper {

    public static function loadedSpeed(City $city_from,$size)
    {
        //Obtenemos el nivel del puerto para calcular su capacidad de carga
        $loaded = config('world.load_speed_base');//Carga base

        //Obtenemos el puerto
        if(BuildingHelper::building($city_from,16)!=null){
            $level = BuildingHelper::building($city_from,16)->building_level->level;
        }else{
            $level = 0;
        }

        $loaded += ($level*config('world.load_speed'));

        $loadedTime = $loaded/60;//Carga por minuto

        return $size/$loadedTime;//Retornamos el tiempo en segundos
    }

    public static function distanceTime(City $city_from,City $city_to)
    {
        //Verificamos si estan en la misma isla
        //if($city_from->islandCity->island_id === $city_to->islandCity->island_id)
        //{
            return config('world.distance.same_island');
       // }
    }

    public static function distanceTimeColonize(City $city_from,Island $island)
    {
        //Verificamos si estan en la misma isla
       // if($city_from->islandCity->island_id === $island->id)
       // {
            return config('world.distance.same_island');
       // }
    }

    public static function getActionPoint(City $city_from)
    {
        return Movement::where('city_from',$city_from->id)->where('user_id',Auth::id())->count();
    }

    public static function returnMovementResources(City $city_from)
    {
        $cities = [$city_from->id];
        self::deliveredResourcesFrom($cities);
        self::deliveredResourcesReturn($cities);
    }

    public static function returnMovementResourcesAll()
    {
        $cities = UserCity::where('user_id',Auth::id())->pluck('city_id');
        self::deliveredResourcesFrom($cities);
        self::deliveredResourcesReturn($cities);
        self::deliveredResourcesTo($cities);
        self::endUserColonize($cities);
    }

    public static function deliveredResourcesReturn($cities)
    {
        $movements = Movement::whereIn('city_from',$cities)
                            ->where('movement_type_id',1)
                            ->where('delivered',1)
                            ->where('return_at','<',Carbon::now())->get();
        $movements->map(function($movement){
            $userResource = UserResource::where('user_id',$movement->user_id)->firstOrFail();
            //Actualizamos sus mercantes
            $userResource->trade_ship_available += $movement->trade_ship;
            $userResource->save();

            //Borramos el movimiento
            $movement->delete();
        });
    }

    public static function deliveredResourcesFrom($cities)
    {
        //Entrega los recursos desde una ciudad
        $movements = Movement::whereIn('city_from',$cities)
                            ->where('movement_type_id',1)
                            ->where('delivered',0)
                            ->where('end_at','<',Carbon::now())->get();
        $movements->map(function($movement){
            //Entregamos los recursos
            $city_to = $movement->city_destine;
            $city_from = $movement->city_origin;
            $resources = $movement->resources;

            $city_to->wood += $resources->wood;
            $city_to->wine += $resources->wine;
            $city_to->marble += $resources->marble;
            $city_to->glass += $resources->glass;
            $city_to->sulfur += $resources->sulfur;

            $city_to->save();

            //Actualizamos el estado a entregado
            $movement->delivered = 1;
            $movement->save();

            //Ingresamos notificacion al mayor
            Mayor::create([
                'city_id'=> $city_from->id,
                'type' => 2,
                'data' => json_encode([
                    'resources'=>$resources,
                    'city_to'=>$city_to->id,
                    'city_name'=>$city_to->name
                ])
            ]);
            event(new UserNotification('advisors','mayor',$movement->user_id));
        });
    }

    public static function deliveredResourcesTo($cities)
    {
        //Actualiza los recursos que llegan a una ciudad
        $movements = Movement::whereIn('city_to',$cities)
                            ->where('movement_type_id',1)
                            ->where('delivered',0)
                            ->where('end_at','<',Carbon::now())->get();
        $movements->map(function($movement){
            //Entregamos los recursos
            $city_to = $movement->city_destine;
            $resources = $movement->resources;

            $city_to->wood += $resources->wood;
            $city_to->wine += $resources->wine;
            $city_to->marble += $resources->marble;
            $city_to->glass += $resources->glass;
            $city_to->sulfur += $resources->sulfur;

            $city_to->save();

            //Actualizamos el estado a entregado
            $movement->delivered = 1;
            $movement->save();
        });
    }

    /*public static function endIslandColonize(Island $island)
    {
        $cities = $island->islandCities->pluck('city_id');
        $movements = Movement::whereIn('city_to',$cities)
                        ->where('movement_type_id',4)
                        ->where('end_at','<',Carbon::now())->get();
        self::endColonize($movements);
        if($movements->count()>0)
        {
            $island->refresh();
        }
    }*/

    public static function endUserColonize($cities)
    {
        $movements = Movement::whereIn('city_from',$cities)
                        ->where('movement_type_id',4)
                        ->where('end_at','<',Carbon::now()->addSeconds(3))->get();
        self::endColonize($movements);
    }

    private static function endColonize($movements)
    {
        $movements->map(function($movement){
            //Quitamos y borramos el movimiento
            $user = User::find($movement->user_id);
            //Damos los 3 mercantes
            $userResource = UserResource::where('user_id',$user->id)->first();
            $userResource->trade_ship_available += $movement->trade_ship;
            $userResource->save();

            $movement->city_destine->constructed_at = Carbon::now();
            $movement->city_destine->save();

            $movement->delete();
        });
    }
}
