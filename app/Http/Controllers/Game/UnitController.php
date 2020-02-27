<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\Regiment;
use App\Models\Unit;
use App\Models\RegimentTail;
use App\Models\CityPopulation;
use App\Helpers\CityHelper;
use App\Helpers\PopulationHelper;
use App\Helpers\UnitHelper;
use App\Helpers\BuildingModifierHelper;

use Auth;
use Carbon\Carbon;

class UnitController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request,City $city)
    {
        $this->authorize('isMyCity',$city);
        $request->validate([
            'units'   => 'required|array',
            'units.*' => 'integer|min:1',
            'cants'   => 'required|array',
            'cants.*' => 'integer|min:1'
        ]);

        //Creamos o obtenemos el regimiento
        $regiment = Regiment::firstOrCreate(['user_id' => Auth::id(), 'city_id' => $city->id]);

        //Verificamos que no haya colas culminadas
        UnitHelper::checkConstructedTime($regiment);

        //Actualizamos la poblacion
        $cityPopulation = CityPopulation::where('city_id',$city->id)->first();
        PopulationHelper::satisfaction($cityPopulation);

        //Obtenemos el numero maximo de colas
        $max_tail = $regiment->tails->max('tail');
        $max_tail = $max_tail===NULL ? 0 : $max_tail+1;

        //Validamos que no pueda mandar a construir mas de 4 colas
        if($max_tail>2)
        {
            return 'Alcanzaste el maximo numero de colas permitidas';
        }

        //Obtenemos solo los valores para que no importen los indices
        $units = array_values($request->input('units'));
        $cants = array_values($request->input('cants'));

        //Verificamos que tengan la misma cantidad de elementos
        if(count($units)!=count($cants))
        {
            return 'La cantidad de elementos del arreglo de unidades no coincide con el de cantidades';
        }

        //Obtenemos las unidades que quiere crear
        $units_db = Unit::whereIn('id',$units)->get();

        //Coleccion con los totales que necesitamos
        $collect = UnitHelper::newCollect();

        //Recorremos para ver que todo este correcto y obtenemos los totales
        foreach($units as $i => $unit_aux)
        {
            $unit = $units_db->find($unit_aux);

            //Verificamos que la unidad exista
            if($unit===NULL)
            {
                return 'No existe la unidad con id '.$unit_aux;
            }

            //Verificamos que tenga el nivel del cuartel necesario
            if(!UnitHelper::checkBarrackLevel($city,$unit))
            {
                return 'No tienes el nivel de cuartel necesario para construir estas tropas';
            }

            //Verificamos que se tenga la investigacion para construirla
            if(!UnitHelper::checkResearch($unit))
            {
                return 'No tienes las investigaciones necesarias para construir estas tropas';
            }

            UnitHelper::addCollect($collect,$unit,$cants[$i]);
        }

        //Validaciones
        //Comparamos que tenga la poblacion necesaria
        if(!PopulationHelper::comparePopulation($city,$collect))
        {
            return 'No tienes suficiente poblacion';
        }

        //Hacemos descuento de recursos
        BuildingModifierHelper::lessCost($city,$collect);

        if(!CityHelper::compareResources($city,$collect))
        {
            return 'No tienes suficientes recursos para construir esto';
        }

        //Quitamos los recursos y ciudadanos
        CityHelper::removeResources($city,$collect);
        PopulationHelper::removePopulation($city,$collect);

        //Recorremos cada unidad mandada a construir
        foreach($units as $i => $unit_aux){

            $unit = $units_db->find($unit_aux);

            //Si todo salio ok se crea la unidad con su cola
            RegimentTail::create(
                [
                    'constructed_at' => Carbon::now()->addSeconds($collect->time),
                    'regiment_id'    => $regiment->id,
                    'unit_id'        => $unit->id,
                    'cant'           => $cants[$i],
                    'tail'           => $max_tail
                ]
            );
        }

        return 'ok';

    }

    public function index()
    {
        //Verificamos que no haya colas culminadas
        UnitHelper::allConstructTails();

        $regiments = Regiment::where('user_id',Auth::id())->get();
        return $regiments->map(function($regiment){
            $data['id']      = $regiment->id;
            $data['city_id'] = $regiment->city_id;
            $data['tails']   = $regiment->tails;
            $data['units']   = $regiment->units->map(function($regiment_unit){
                $data         = $regiment_unit->only(['cant','unit_id']);
                $data['size'] = $regiment_unit->unit->size;
                return $data;
            });
            return $data;
        });
    }
}
