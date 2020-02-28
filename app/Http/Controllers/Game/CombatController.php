<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Movement;
use App\Models\City;
use App\Models\MovementRegiment;
use App\Models\Regiment;
use App\Models\RegimentUnit;
use App\Models\UserResource;
use App\Helpers\CombatHelper;
use App\Helpers\MovementHelper;
use App\Helpers\UserResourceHelper;

use Carbon\Carbon;
use Auth;

class CombatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    private function combat_movement(Request $request,City $city,$type)
    {
        $this->authorize('isNotMyCity',$city);
        $request->validate([
            'city_from' => 'required|integer|min:1',
            'units'   => 'required|array',
            'units.*' => 'integer|min:1',
            'cants'   => 'required|array',
            'cants.*' => 'integer|min:1',
            'trade_ship' => 'required|integer|min:1'
        ]);

        //Si es defensa debe enviar cuantas horas va a defender la ciudad
        if($type==3)
        {
            $request->validate(['hours' => 'required|integer|min:1|max:24']);
        }

        //validar ciudad destino diferente a la ciudad de las tropas
        if($request->input('city_from')==$city->id)
        {
            return 'No puedes atacar la ciudad donde estan tus tropas';
        }

        //Verificamos que tenga unidades en esa ciudad
        $regiment = Regiment::where('user_id',Auth::id())->where('city_id',$request->input('city_from'))->notTravel()->firstOrFail();

        //Obtenemos la ciudad de origen
        $city_from = City::find($request->input('city_from'));

        //Retornamos movimientos
        //MovementHelper::returnMovementResources($city);

        //Verificar puntos de accion
        $apoint = MovementHelper::getActionPoint($city_from);
        if($apoint >= $city_from->apoint)
        {
            return 'Alcanzaste el maximo de puntos de accion de la ciudad';
        }

        //Verificamos que tenga los barcos mercantes que quiere enviar
        $trade_ship = $request->input('trade_ship');
        $userResource = UserResource::where('user_id',Auth::id())->firstOrFail();
        if($trade_ship>$userResource->trade_ship_available)
        {
            return 'No tienes barcos mercantes suficientes';
        }

        //Obtenemos solo los valores para que no importen los indices
        $units = array_values($request->input('units'));
        $cants = array_values($request->input('cants'));

        //Verificamos que tengan la misma cantidad de elementos
        if(count($units)!=count($cants))
        {
            return 'La cantidad de elementos del arreglo de unidades no coincide con el de cantidades';
        }

        //Determina si hay que crear un nuevo regimiento
        $newRegiment = false;
        $sizeRegiment = 0;//Tamanio del regimiento

        //Recorremos las unidades del regimiento
        foreach($units as $i => $unit_aux)
        {
            $cant = $cants[$i];
            $regimentUnit = $regiment->units->where('unit_id',$unit_aux)->first();

            //agregamos el tamanio
            $sizeRegiment = $regimentUnit->unit->size * $cant;
            //Verificamos que la cantidad que quiere enviar es mayor que la que tiene el regimiento
            if($cant>$regimentUnit->cant)
            {
                return 'No tienes suficientes tropas en esa ciudad';
            }
            if($cant!=$regimentUnit->cant)
            {
                //Como queremos enviar menos tropas de las que tenemos creamos un nuevo regimiento
                $newRegiment = true;
            }
        }

        //Verificamos que tenga el tamanio de barco suficiente
        if($sizeRegiment>($trade_ship*config('world.transport')))
        {
            return 'No tienes los suficientes barcos mercantes para transportar estas unidades';
        }

        //Creamos nuevo regimiento con las unidades seleccionadas
        if($newRegiment)
        {
            $new_regiment = Regiment::create(['user_id' => Auth::id(),'city_id' => $city_from->id]);
            foreach($units as $i => $unit_aux)
            {
                $cant = $cants[$i];
                $regimentUnit = $regiment->units->where('unit_id',$unit_aux)->first();
                //Separamos las tropas
                $regimentUnit->cant -= $cant;
                $regimentUnit->save();
                RegimentUnit::create([
                    'regiment_id' => $new_regiment->id,
                    'unit_id' => $regimentUnit->unit_id,
                    'cant' => $cant
                ]);
            }
            $regiment = $new_regiment;
        }

        $loadedTime = MovementHelper::loadedSpeed($city_from,$sizeRegiment);
        $transportTime = MovementHelper::distanceTime($city_from,$city);

        $start_at = Carbon::now()->addSeconds($loadedTime);
        $end_at = Carbon::now()->addSeconds($transportTime + $loadedTime);

        //Si es defensa retorna en las horas que puso a defender
        if($type==3)
        {
            $return_at = Carbon::now()->addSeconds(($transportTime + $loadedTime) + ($request->input('hours')*3600) );
        }
        else
        {
            $return_at = NULL;
        }


        //Creamos el movimiento
        $movement = new Movement();
        $movement->start_at = $start_at;
        $movement->end_at = $end_at;
        $movement->return_at = $return_at;
        $movement->user_id = Auth::id();
        $movement->city_from = $city_from->id;
        $movement->city_to = $city->id;
        $movement->movement_type_id = $type;
        $movement->trade_ship = $trade_ship;
        $movement->delivered = 0;
        $movement->save();

        //Creamos el movimiento del regimiento
        MovementRegiment::create([
            'movement_id' => $movement->id,
            'regiment_id' => $regiment->id,
            'size' => $sizeRegiment
        ]);

        //Actualizamos el oro
        UserResourceHelper::updateResources();

        //Ponemos al regimiento a viajar
        $regiment->travel = 1;
        $regiment->save();

        //Quitamos los mercantes
        $userResource->trade_ship_available -= $trade_ship;
        $userResource->save();


        return 'ok';

    }

    public function attack(Request $request,City $city)
    {
        return $this->combat_movement($request,$city,2);
    }

    public function defend(Request $request,City $city)
    {
        return $this->combat_movement($request,$city,3);
    }
}
