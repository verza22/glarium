<?php

namespace App\Helpers;

use App\Models\RegimentUnit;
use App\Models\CombatReport;
use App\Models\CombatReportDetail;
use App\Models\Regiment;
use App\Models\Movement;
use App\Models\City;
use App\Models\CityBuilding;
use App\Models\MovementResource;
use App\Models\MovementRegiment;
use App\Helpers\CityHelper;
use App\Helpers\WarehouseHelper;
use App\Helpers\UnitHelper;
use App\Helpers\MovementHelper;
use Carbon\Carbon;

class CombatHelper {

    private static function getMejorValorAttack($units,$type)
    {
        $result =  $units->map(function($unit) use ($type) {
            //Retornamos unicamente el tipo de defensa que queremos
            if($unit->unit->attack_type===$type)
            {
                $power = $unit->unit->attack * $unit->cant;
                $value = $unit->unit->attack;
                return ['id' => $unit->id, 'power' => $power,'value' => $value,'cant' => $unit->cant,'unit_id' => $unit->unit_id];
            }
        });

        //Obtenemos el mejor valor del ataque
        $power = $result->max('power');
        $unit  = $result->where('power',$power)->first();
        return $power===NULL ? NULL : [ 'power' => $power, 'unit' => $unit ];
    }

    private static function getMejorValorDefense($units,$type)
    {
        $result =  $units->map(function($unit) use ($type) {
            //Retornamos unicamente el tipo de defensa que queremos
            switch($type)
            {
                case 1:
                    //Retornamos blunt
                    $power = $unit->unit->defense_blunt * $unit->cant;
                    $value = $unit->unit->defense_blunt;
                break;
                case 2:
                    //Retornamos sharp
                    $power = $unit->unit->defense_sharp * $unit->cant;
                    $value = $unit->unit->defense_sharp;
                break;
                case 3:
                    //Retornamos distance
                    $power = $unit->unit->defense_distance * $unit->cant;
                    $value = $unit->unit->defense_distance;
                break;
            }
            return ['id' => $unit->id, 'power' => $power,'value' => $value,'cant' => $unit->cant,'unit_id' => $unit->unit_id];
        });

        //Obtenemos el mejor valor de la defensa
        $power = $result->max('power');
        $unit  = $result->where('power',$power)->first();
        return $power===NULL ? NULL : [ 'power' => $power, 'unit' => $unit ];
    }

    private static function ronda($regimentAttack,$regimentDefense,$combatReport,$round,$defenseBonus)
    {
        //Obtenemos las unidades de esos regimientos
        $unitsAttack = RegimentUnit::whereIn('regiment_id',$regimentAttack)->get();
        $unitsDefens = RegimentUnit::whereIn('regiment_id',$regimentDefense)->get();

        //Si los dos tienen unidades el combate continua
        if($unitsDefens->count()>0&&$unitsAttack->count()>0)
        {
            //Recorremos cada uno de los tipos de ataque
            for($i=1;$i<=3;$i++)
            {
                //Obtenemos la mejor unidad de ataque
                $dataAttack  = self::getMejorValorAttack($unitsAttack,$i);
                $datadefense = self::getMejorValorDefense($unitsDefens,$i);

                //El atacante no tiene unidades de este tipo
                if($dataAttack!=NULL&&$datadefense!=NULL)
                {
                    $round++;
                    //Aplicamos bonus de defensa de la muralla
                    $datadefense['power'] = $datadefense['power'] * $defenseBonus;
                    //Comparamos el ganador y el otro se muere
                    if($datadefense['power']>=$dataAttack['power'])
                    {
                        //Gana el defensor
                        $datadefense['power'] -= $dataAttack['power'];
                        
                        $defensaCant = ceil($datadefense['power']/$datadefense['unit']['value']);//Sobrevivientes al ataque
                        
                        RegimentUnit::whereId($dataAttack['unit']['id'])->delete();//Se muere el atacante
                        RegimentUnit::whereId($datadefense['unit']['id'])->update(['cant' => $defensaCant]);

                        CombatReportDetail::create([
                            'combat_report_id' => $combatReport->id,
                            'round' => $round,
                            'type_attack' => $i,
                            'result' => 2,
                            'attack_unit_id' => $dataAttack['unit']['unit_id'],
                            'attack_before_cant' => $dataAttack['unit']['cant'],
                            'attack_after_cant' => 0,
                            'defense_unit_id' => $datadefense['unit']['unit_id'],
                            'defense_before_cant' => $datadefense['unit']['cant'],
                            'defense_after_cant' => $defensaCant
                        ]);
                    }
                    else
                    {
                        //Gana el atacante
                        $dataAttack['power'] -= $datadefense['power'];
                        $attackCant = ceil($dataAttack['power']/$dataAttack['unit']['value']);//Sobrevivientes al ataque
                        RegimentUnit::whereId($datadefense['unit']['id'])->delete();//Se muere el defensor
                        RegimentUnit::whereId($dataAttack['unit']['id'])->update(['cant' => $attackCant]);

                        CombatReportDetail::create([
                            'combat_report_id' => $combatReport->id,
                            'round' => $round,
                            'type_attack' => $i,
                            'result' => 1,
                            'attack_unit_id' => $dataAttack['unit']['unit_id'],
                            'attack_before_cant' => $dataAttack['unit']['cant'],
                            'attack_after_cant' => $attackCant,
                            'defense_unit_id' => $datadefense['unit']['unit_id'],
                            'defense_before_cant' => $datadefense['unit']['cant'],
                            'defense_after_cant' => 0
                        ]);
                    }
                    //Actualizamos la informacion
                    $unitsAttack = RegimentUnit::whereIn('regiment_id',$regimentAttack)->get();
                    $unitsDefens = RegimentUnit::whereIn('regiment_id',$regimentDefense)->get();
                }
            }
        }
        if($unitsDefens->count()>0&&$unitsAttack->count()>0)
        {
            //Nueva ronda
            self::ronda($regimentAttack,$regimentDefense,$combatReport,$round,$defenseBonus);
        }
        else
        {
            //Verificamos quien gana
            if(RegimentUnit::whereIn('regiment_id',$regimentAttack)->count()===0)
            {
                $combatReport->result = 2;//Gano defensor
            }
            if(RegimentUnit::whereIn('regiment_id',$regimentDefense)->count()===0)
            {
                $combatReport->result = 1;//Gano atacante
            }

            $combatReport->save();
        }
    }

    public static function checkAttack(MovementRegiment $movementRegiment,$city_to)
    {
        //Obtenemos los regimientos de ataque y defensa en total
        $regimentAttack = Regiment::where('id',$movementRegiment->regiment_id)->select('id')->pluck('id');
        $regimentDefense = Regiment::where('city_id',$city_to)->notTravel()->select('id')->pluck('id');

        //Creamos el reporte
        $combatReport = CombatReport::create(['movement_regiment_id'=>$movementRegiment->id]);
        $round = 0;

        //Conseguimos el nivel de la muralla
        $cityBuilding = CityBuilding::where('city_id',$city_to)->whereHas('building_level',function($query){
            $query->where('building_id',19);
        })->first();

        $level = $cityBuilding!=NULL ? $cityBuilding->building_level->level : 0;
        
        //Aplicamos bonus de muralla
        $defenseBonus = ( 1 + ( $level * config('world.combat.wall_bonus') ) );
        
        self::ronda($regimentAttack,$regimentDefense,$combatReport,$round,$defenseBonus);

        return $combatReport->result;
    }
    
    public static function getResourceSteal(City $city,$size)
    {
        //Devuelve una collecion de recursos a saquear
        //Actualizamos los recursos de la ciudad
        CityHelper::updateResources($city);

        //verificamos si tiene un deposito para proteger recursos
        $capacity = WarehouseHelper::checkProtected($city);
        $totalCapacity = $capacity + config('world.resource_protected');

        $collect = UnitHelper::newCollect();
        //Asignamos los recursos robables menos los que estan protegidos
        $collect->wood   = $city->wood   > $totalCapacity ? $city->wood   - $totalCapacity : 0;
        $collect->wine   = $city->wine   > $totalCapacity ? $city->wine   - $totalCapacity : 0;
        $collect->marble = $city->marble > $totalCapacity ? $city->marble - $totalCapacity : 0;
        $collect->glass  = $city->glass  > $totalCapacity ? $city->glass  - $totalCapacity : 0;
        $collect->sulfur = $city->sulfur > $totalCapacity ? $city->sulfur - $totalCapacity : 0;

        //Restamos para obtener solo los recursos para los cuales tenemos capacidad de lleveranos
        $totalResources = $collect->wood+$collect->wine+$collect->marble+$collect->glass+$collect->sulfur;

        //Si tengo capacidad para llevarme todos los recursos aqui termina
        if($size>=$totalResources)
        {
            return $collect;
        }
        else
        {
            //Obtenemos equitativamente los recursos para llevarnos
            //Porcentaje para llevarme cada recurso equitativamente
            $per = $size/$totalResources;
            $collect->wood   = $collect->wood   * $per;
            $collect->wine   = $collect->wine   * $per;
            $collect->marble = $collect->marble * $per;
            $collect->glass  = $collect->glass  * $per;
            $collect->sulfur = $collect->sulfur * $per;
            return $collect;
        }

    }

    public static function endAttack(Movement $movement)
    { 
        //Actualizamos la cola de unidades de la ciudad destino
        Regiment::where('city_id',$movement->city_destine->id)->notTravel()->get()
        ->map(function($regiment){
            UnitHelper::checkConstructedTime($regiment);
        });

        //Actualizamos todas las defensas de la ciudad destino
        //Movimiento que el usuario hizo a otras ciudades y que lo estan defendiendo
        self::endAndReturnDefendCity($movement->city_destine,'city_from');
        self::endAndReturnDefendCity($movement->city_destine,'city_to');

        //Termina ataques del movement
        //Obtenemos los datos para hacer el combate
        $city_to = $movement->city_to;
        //Hacemos el combate
        $combatResult = CombatHelper::checkAttack($movement->movement_regiment,$city_to);

        //Verificamos quien gano el combate
        if($combatResult==1)
        {
            //Gano el atacante creamos el tiempo de retorno, lo ponemos delivered y creamos la orden recursos
            $transportTime = MovementHelper::distanceTime($movement->city_origin,$movement->city_destine);

            $movement->delivered = 1;
            $movement->return_at = Carbon::now()->addSeconds($transportTime + config('world.load_attack_return'));

            //Total de recursos que puedo saquear
            $size = ($movement->trade_ship*config('world.transport') - $movement->movement_regiment->size);

            //Obtenemos los recursos que podemos saquear
            $collect = CombatHelper::getResourceSteal($movement->city_destine,$size);

            //Quitamos los recursos a la ciudad de destino
            CityHelper::removeResources($movement->city_destine,$collect);

            //Creamos la orden de recursos
            //Creamos el movimiento de recursos
            MovementResource::create([
                'movement_id' => $movement->id,
                'wood' => $collect->wood,
                'wine' => $collect->wine,
                'marble' => $collect->marble,
                'glass' => $collect->glass,
                'sulfur' => $collect->sulfur
            ]);

            $movement->save();

            self::clearDefenses($movement->city_destine);
        }
        else
        {
            //Lo ganaron los defensores
            $movement->movement_regiment->regiment->delete();
            $movement->user->resources->trade_ship_available += $movement->trade_ship;
            $movement->user->resources->save();
            $movement->delete();
        }

        //Actualizamos el oro
        UserResourceHelper::updateResources();
    }

    public static function returnAttack(Movement $movement)
    {
        //Retorna ataques del modelo movement
        //Entregamos los recursos
        $city_from = $movement->city_origin;
        $resources = $movement->resources;

        //Actualizamos recursos de la ciudad de origen
        CityHelper::updateResources($city_from);

        //Asignamos recursos saqueados
        $city_from->wood += $resources->wood;
        $city_from->wine += $resources->wine;
        $city_from->marble += $resources->marble;
        $city_from->glass += $resources->glass;
        $city_from->sulfur += $resources->sulfur;

        $city_from->save();

        //Actualizamos el oro
        UserResourceHelper::updateResources();

        //Actualizamos el regimiento que ya no esta viajando
        $regiment = $movement->movement_regiment->regiment;

        //Verificamos la ciudad de origen y vemos si hay otros regimientos del jugador
        //Si el jugador tiene otros regimientos se deben unificar en uno solo
        $other_regiment = Regiment::where('user_id',$movement->user_id)->notTravel()
        ->where('city_id',$city_from->id)
        ->where('id','!=',$regiment->id)->first();

        //Verificamos si existe otro regimiento para unificarlos
        if($other_regiment!=NULL)
        {
            $regiment->units->map(function($regiment_unit) use($other_regiment) {
                $other_regiment_unit = $other_regiment->units->where('unit_id',$regiment_unit->unit_id)->first();
                //Verificamos si el otro regimiento de la ciudad tiene cada tropa si no la creamos
                if($other_regiment_unit!=NULL)
                {
                    $other_regiment_unit->cant += $regiment_unit->cant;
                    $other_regiment_unit->save();
                }
                else
                {
                    RegimentUnit::create([
                        'regiment_id' => $other_regiment->id,
                        'unit_id' => $regiment_unit->unit_id,
                        'cant' => $regiment_unit->cant,
                    ]);
                }
                $regiment_unit->delete();
            });
            $regiment->delete();
        }
        else
        {
            $regiment->travel = 0;
            $regiment->save();
        }

        //Devolvemos el mercante
        $movement->user->resources->trade_ship_available += $movement->trade_ship;
        $movement->user->resources->save();

        //Terminamos el movimiento
        $movement->delete();
    }

    public static function endAndReturnAttackFromCity(City $city)
    {
        //Termina y retorna ataques de una ciudad
        //Obtenemos los movimientos que este saqueando el jugador
        Movement::where('city_from',$city->id)
        ->where('movement_type_id',2)
        ->where('end_at','<',Carbon::now())
        ->where('delivered',0)->get()
        ->map(function($movement){
            self::endAttack($movement);
        });

        //Verificamos movimientos que ya terminaron
        Movement::where('city_from',$city->id)
        ->where('movement_type_id',2)
        ->where('return_at','<',Carbon::now())
        ->where('delivered',1)->get()
        ->map(function($movement){
            self::returnAttack($movement);
        });
    }

    public static function endAndReturnAttackToCity(City $city)
    {
        //Termina y retorna ataques a una ciudad
        //Obtenemos los movimientos que este saqueando el jugador
        Movement::where('city_to',$city->id)
        ->where('movement_type_id',2)
        ->where('end_at','<',Carbon::now())
        ->where('delivered',0)->get()
        ->map(function($movement){
            self::endAttack($movement);
        });

        //Verificamos movimientos que ya terminaron
        Movement::where('city_to',$city->id)
        ->where('movement_type_id',2)
        ->where('return_at','<',Carbon::now())
        ->where('delivered',1)->get()
        ->map(function($movement){
            self::returnAttack($movement);
        });
    }

    public static function transportDefend(Movement $movement)
    {
        //Transportamos las tropas de una ciudad a otra que ya llegaron al destino
        $regiment = $movement->movement_regiment->regiment;
        $regiment->travel = 0;
        $regiment->city_id = $movement->city_destine->id;
        $regiment->save();

        $movement->delivered = 1;
        $movement->save();
    }

    public static function returnDefend(Movement $movement)
    {
        //Actualiza el estado del movimiento y pone a viajar de regreso al regimiento
        $regiment = $movement->movement_regiment->regiment;
        //Verificamos que exista el regimiento (Que no haya sido destruido mientras defendia la ciudad)
        if($regiment!=NULL)
        {
            //Si todavia existe el regimiento lo ponemos a viajar
            $regiment->travel = 1;
            $regiment->save();

            //Calculamos el tiempo de transporte
            //Y cambiamos el estado a delivered 2 para indicar que esta regresando
            $transportTime = MovementHelper::distanceTime($movement->city_origin,$movement->city_destine);

            $movement->return_at = Carbon::now()->addSeconds(($transportTime + config('world.load_defend_return')));
            $movement->delivered = 2;
            $movement->save();
        }
        else
        {
            //Si fue destruido borramos el movimiento y devolvemos mercantes
            $movement->user->resources->trade_ship_available += $movement->trade_ship;
            $movement->user->resources->save();
            $movement->delete();
        }
    }

    public static function endDefend(Movement $movement)
    {
        //Retorna un regimiento a la ciudad de origen
        $regiment = $movement->movement_regiment->regiment;
        $regiment->travel = 0;
        $regiment->city_id = $movement->city_origin->id;
        $regiment->save();

        //Actualizamos los mercantes
        $movement->user->resources->trade_ship_available += $movement->trade_ship;
        $movement->user->resources->save();
        $movement->delete();
    }

    public static function endAndReturnDefendCity(City $city,$type)
    {
        //El type indica si es city_from o city_to

        //Termina y retorna defensas de una ciudad
        //Obtenemos los movimientos del jugador
        Movement::where($type,$city->id)
        ->where('movement_type_id',3)
        ->where('end_at','<',Carbon::now())
        ->where('delivered',0)->get()
        ->map(function($movement){
            self::transportDefend($movement);
        });

        //Verificamos movimientos que ya terminaron y mandamos a retornarlos
        Movement::where($type,$city->id)
        ->where('movement_type_id',3)
        ->where('return_at','<',Carbon::now())
        ->where('delivered',1)->get()
        ->map(function($movement){
            self::returnDefend($movement);
        });

        //Movimientos que ya regresaron a la ciudad y debemos finalizar
        Movement::where($type,$city->id)
        ->where('movement_type_id',3)
        ->where('return_at','<',Carbon::now())
        ->where('delivered',2)->get()
        ->map(function($movement){
            self::endDefend($movement);
        });
    }

    public static function clearDefenses(City $city)
    {
        //Revisa las defensas de una ciudad, devuelve sus movimientos y elimina sus regimientos
        Movement::where('city_to',$city->id)
        ->where('movement_type_id',3)
        ->where('end_at','<',Carbon::now())
        ->where('delivered',1)
        ->get()->map(function($movement){
            $regiment = $movement->movement_regiment->regiment;
            //Si no tiene unidades
            if($regiment->units->count()===0)
            {
                //Borramos el regimiento
                $regiment->delete();
                //Devolvemos los mercantes
                $movement->user->resources->trade_ship_available += $movement->trade_ship;
                $movement->user->resources->save();
                //El movimiento se elimina liberando un punto de accion
                $movement->delete();
            }
        });
    }
}