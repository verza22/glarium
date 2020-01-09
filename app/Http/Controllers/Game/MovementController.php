<?php

namespace App\Http\Controllers\Game;

use App\Helpers\BuildingHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\MovementType;
use App\Models\Movement;
use App\Models\MovementResource;
use App\Models\UserResource;
use App\Models\CityBuilding;
use App\Models\UserCity;
use App\Models\Island;
use App\Events\UserNotification;
use App\Helpers\UnitHelper;
use App\Helpers\CityHelper;
use App\Helpers\MovementHelper;
use App\Helpers\OtherHelper;
use App\Helpers\UserResourceHelper;
use App\Helpers\PopulationHelper;
use App\Models\IslandCity;
use Carbon\Carbon;
use Auth;

class MovementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function transport(Request $request,City $city)
    {
        //Verificamos que la ciudad sea del jugador
        $this->authorize('isMyCity',$city);

        $request->validate([
            'city_to' => 'required|integer|min:0',
            'wood' => 'integer|min:0',
            'wine' => 'integer|min:0',
            'marble' => 'integer|min:0',
            'glass' => 'integer|min:0',
            'sulfur' => 'integer|min:0'
        ]);

        //Retornamos movimientos
        //MovementHelper::returnMovementResources($city);

        //Verificar puntos de accion
        $apoint = MovementHelper::getActionPoint($city);
        if($apoint >= $city->apoint)
        {
            return 'Alcanzaste el maximo de puntos de accion de la ciudad';
        }

        //Verficiamos que exista la ciudad de destino
        $city_to = City::findOrFail($request->input('city_to'));

        //Verificamos que las ciudades sean distintas
        if($city->id === $city_to->id)
        {
            return 'No puedes enviar un movimiento a la misma ciudad de origen';
        }

        //Verificamos que tenga minimo un mercante disponible
        $userResource = UserResource::where('user_id',Auth::id())->firstOrFail();

        if($userResource->trade_ship_available < 1)
        {
            return 'No tienes mercantes disponibles';
        }

        $collect = UnitHelper::newCollect();
        $collect->wood += $request->input('wood');
        $collect->wine += $request->input('wine');
        $collect->marble += $request->input('marble');
        $collect->glass += $request->input('glass');
        $collect->sulfur += $request->input('sulfur');

        //Verificamos que la ciudad tenga los recursos
        if(!CityHelper::compareResources($city,$collect))
        {
            return 'No tienes los recursos necesarios';
        }

        $total = $collect->wood + $collect->wine + $collect->marble + $collect->glass + $collect->sulfur;

        //Verificamos que la capacidad no sea cero
        if($total==0)
        {
            return 'Debes transportar algun recurso';
        }

        //Verificamos que tenga la capacidad de barcos
        $maxCapacity = config('world.transport')*$userResource->trade_ship_available;
        if($total > $maxCapacity)
        {
            return 'No puedes transportar mas recursos de la capacidad maxima que dispones, compra mas mercantes';
        }

        $usedShips = ceil($total/config('world.transport'));

        $loadedTime = MovementHelper::loadedSpeed($city,$total);
        $transportTime = MovementHelper::distanceTime($city,$city_to);

        $start_at = Carbon::now()->addSeconds($loadedTime);
        $end_at = Carbon::now()->addSeconds($transportTime + $loadedTime);
        if(UserCity::where('user_id',Auth::id())->pluck('city_id')->contains($city_to->id))
        {
            $return_at = $end_at;
        }
        else
        {
            $return_at = Carbon::now()->addSeconds(($transportTime*2) + $loadedTime);
        }


        //Quitamos los recursos
        CityHelper::removeResources($city,$collect);

        //Creamos el movimiento
        $movement = new Movement();
        $movement->start_at = $start_at;
        $movement->end_at = $end_at;
        $movement->return_at = $return_at;
        $movement->user_id = Auth::id();
        $movement->city_from = $city->id;
        $movement->city_to = $city_to->id;
        $movement->movement_type_id = 1;
        $movement->trade_ship = $usedShips;
        $movement->delivered = 0;
        $movement->save();

        //Creamos el movimiento de recursos
        MovementResource::create([
            'movement_id' => $movement->id,
            'wood' => $collect->wood,
            'wine' => $collect->wine,
            'marble' => $collect->marble,
            'glass' => $collect->glass,
            'sulfur' => $collect->sulfur
        ]);

        //Quitamos los barcos mercantes
        $userResource->trade_ship_available -= $usedShips;
        $userResource->save();

        //Avisamos al general de destino
        event(new UserNotification('advisors','general',$city_to->userCity->user_id));

        return 'ok';
    }

    public function from_update(City $city)
    {
        $this->authorize('isMyCity',$city);
        MovementHelper::returnMovementResources($city);

        return 'ok';
    }

    public function to_update(City $city)
    {
        $this->authorize('isMyCity',$city);
        MovementHelper::deliveredResourcesTo($city);

        return 'ok';
    }

    public function colonize(Request $request,City $city)
    {
        $this->authorize('isMyCity',$city);
        $request->validate([
            'island' => 'required|integer|min:1',
            'position' => 'required|integer|min:1|max:16'
        ]);

        //Obtenemos la capital
        $capital = UserCity::where('user_id',Auth::id())->where('capital',1)->firstOrFail();

        //Validamos que tenga un palacio
        if(!BuildingHelper::buildingExist($capital->city,17)){
            return 'No tienes un palacio';
        }

        $cityBuilding = BuildingHelper::building($capital->city,17);

        $palaceLevel = $cityBuilding->building_level->level;

        //Validamos que pueda colonizar otra ciudad
        if(UserCity::where('user_id',Auth::id())->count()>$palaceLevel)
        {
            return 'Para colonizar otra colonia debes ampliar el palacio';
        }

        //Retornamos mercantes
        MovementHelper::returnMovementResources($city);

        //Validamos que tenga los mercantes necesarios
        $userResource = UserResource::where('user_id',Auth::id())->firstOrFail();

        if($userResource->trade_ship_available < 3)
        {
            return 'No tienes mercantes disponibles';
        }

        //Actualizamos el oro
        UserResourceHelper::updateResources();

        //Validamos que tenga el oro
        if($userResource->gold<config('world.colonize.gold'))
        {
            return 'No tienes oro suficiente para colonizar';
        }

        PopulationHelper::satisfaction($city->population);

        $collect = UnitHelper::newCollect();
        $collect->wood = config('world.colonize.wood');
        $collect->population = config('world.colonize.population');

        //Validamos que tenga la poblacion
        if(!PopulationHelper::comparePopulation($city,$collect))
        {
            return 'No tienes suficientes ciudadanos para colonizar';
        }

        //Validamos que tenga los recursos para colonizar
        if($city->wood<$collect->wood)
        {
            return 'No tienes madera suficiente para colonizar';
        }

        //Verificar puntos de accion
        $apoint = MovementHelper::getActionPoint($city);
        if($apoint >= $city->apoint)
        {
            return 'Alcanzaste el maximo de puntos de accion de la ciudad';
        }

        $position = $request->input('position');
        //Verificamos que no haya una ciudad en esa posicion
        $island = Island::whereId($request->input('island'))->firstOrFail();
        $islandCity = $island->islandCities->where('position',$position)->count();
        if($islandCity > 0)
        {
            return 'Ya hay una ciudad en esa posicion';
        }

        $loadedTime = MovementHelper::loadedSpeed($city,1250);
        $transportTime = MovementHelper::distanceTimeColonize($city,$island);

        $start_at = Carbon::now()->addSeconds($loadedTime);
        $end_at = Carbon::now()->addSeconds($transportTime + $loadedTime);

        //Quitamos los recursos
        CityHelper::removeResources($city,$collect);
        PopulationHelper::removePopulation($city,$collect);
        $userResource->gold -= config('world.colonize.gold');
        $userResource->trade_ship_available -= 3;
        $userResource->save();

        /*Creamos la ciudad*/
        $city_to = OtherHelper::createCity(Auth::user(),$island->id,$position);

        //Creamos el movimiento
        $movement = new Movement();
        $movement->start_at = $start_at;
        $movement->end_at = $end_at;
        $movement->user_id = Auth::id();
        $movement->city_from = $city->id;
        $movement->city_to = $city_to;
        $movement->movement_type_id = 4;
        $movement->trade_ship = 3;
        $movement->delivered = 0;
        $movement->save();

        return 'ok';
    }

    public function getMovement()
    {
        //Devuelve los movimientos de colonizacion,recursos,ataques y defensas
        MovementHelper::returnMovementResourcesAll();
        $cities = CityHelper::myCities();
        return Movement::where('user_id',Auth::id())
        ->orWhereIn('city_to',$cities)->get()->map(function($movement) use ($cities){
            if (in_array($movement->city_destine->id,$cities->toArray())) {
                //Si la ciudad de destino es una de las ciudades del jugador verificamos
                //que no mostramos cuando el movimiento renorne
                if($movement->delivered===1){
                    return false;
                }
            }
            $data = $movement->only(['id','start_at','end_at','return_at','delivered','user_id','movement_type_id','trade_ship']);
            if($movement->resources!=NULL)
            $data['resources']= $movement->resources->only(['wood','wine','marble','glass','sulfur']);
            $data['city_to']['id'] = $movement->city_destine->id;
            $data['city_to']['name'] = $movement->city_destine->name;
            $data['city_to']['user'] = $movement->city_destine->userCity->user->name;
            $data['city_from']['id'] = $movement->city_origin->id;
            $data['city_from']['name'] = $movement->city_origin->name;
            $data['city_from']['user'] = $movement->city_origin->userCity->user->name;
            return $data;
        })->filter(function ($value) {
            return $value != false;
        })->values()->all();
    }

}
