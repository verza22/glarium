<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\UserCity;
use App\Models\CityBuilding;
use App\Models\BuildingLevel;
use App\Models\Building;
use App\Models\UserResearch;
use App\Models\ResearchBuilding;
use App\Helpers\BuildingHelper;
use App\Helpers\CityHelper;
use App\Models\Unit;
use Carbon\Carbon;
use Auth;

class BuildingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function buildings()
    {
        //Obtiene y devuelve los edificios del jugador
        $cities = CityHelper::myCities();
        BuildingHelper::updateConstructedTime($cities,1);

        return CityBuilding::whereIn('city_id',$cities)->get()->map(function($building){
            return [
                'id' => $building->id,
                'city_id' => $building->city_id,
                'position' => $building->position,
                'building_id' => $building->building_level->building_id,
                'level' => $building->building_level->level,
                'constructed_at' => $building->constructed_at,
            ];
        });
    }

    public function buildingsAvaible(Request $request,City $city)
    {
        //Devuelve los edificios disponibles para construir segun su posicion
        $request->validate(['position' => 'required|integer|min:1|max:15']);
        //Obtenemos los edificios investigados por el usuario
        $research_id = UserResearch::where('user_id',Auth::id())->pluck('research_id');

        //Obtenemos los edificios construidos
        $cityBuilding = CityBuilding::where('city_id',$city->id)->get()->map(function($cityBuilding){
            return ['building_id'=>$cityBuilding->building_level->building_id];
        })->pluck('building_id');

        //Consultamos los edificios que se investigan y que aun no tengo sus investigaciones
        $researchBuilding = ResearchBuilding::whereNotIn('research_id',$research_id)->pluck('building_id');

        //Consultamos los edificios
        $query = Building::whereNotIn('id',$researchBuilding);

        //Quitamos los edificios construidos
        $query->whereNotIn('id',$cityBuilding);

        //Verifiamos si es capital
        $query2 = ResearchBuilding::whereNotIn('research_id',$research_id)->whereNotIn('building_id',$cityBuilding);
        if($city->userCity->capital==1)
        {
            $query2->where('building_id','!=',18);
            $query->where('id','!=',18);
        }
        else
        {
            $query2->where('building_id','!=',17);
            $query->where('id','!=',17);
        }

        //Quitamos los edificios que no se construyen en la isla
        switch($city->islandCity->island->type){
            case 1:
                $query->whereNotIn('id',[12,13,15]);
                $query2->whereNotIn('building_id',[12,13,15]);
            break;
            case 2:
                $query->whereNotIn('id',[12,13,14]);
                $query2->whereNotIn('building_id',[12,13,14]);
            break;
            case 3:
                $query->whereNotIn('id',[13,14,15]);
                $query2->whereNotIn('building_id',[13,14,15]);
            break;
            case 4:
                $query->whereNotIn('id',[12,14,15]);
                $query2->whereNotIn('building_id',[12,14,15]);
            break;
        }

        //Verificamos las posiciones
        switch($request->input('position')){
            case 13:
                $query->where('id',19);
                $query2->where('building_id',19);
            break;
            case 14:
                $query->where('id',16);
                $query2->where('building_id',16);
            break;
            default:
                $query->whereNotIn('id',[16,19]);
            break;
        }

        $building_available = $query->get()->map(function($building){
            $buildingLevel = BuildingLevel::where('building_id',$building->id)->where('level',1)->first();
            return [
                'id' => $building->id,
                'wood' => $buildingLevel->wood,
                'wine' => $buildingLevel->wine,
                'marble' => $buildingLevel->marble,
                'glass' => $buildingLevel->glass,
                'sulfur' => $buildingLevel->sulfur,
                'time' => $buildingLevel->time,
                'research' => true
            ];
        });

        //Edificios por investigar
        $building_research = $query2->get()->map(function($researchBuilding){
            $buildingLevel = BuildingLevel::where('building_id',$researchBuilding->building->id)->where('level',1)->first();
            return [
                'id' => $researchBuilding->building->id,
                'wood' => $buildingLevel->wood,
                'wine' => $buildingLevel->wine,
                'marble' => $buildingLevel->marble,
                'glass' => $buildingLevel->glass,
                'sulfur' => $buildingLevel->sulfur,
                'time' => $buildingLevel->time,
                'research' => false,
                'research_id' => $researchBuilding->research_id
            ];
        });

        $buildings = [];
        if($building_research->count()>0)
        $buildings = $building_research->merge($buildings);
        if($building_available->count()>0)
        $buildings = $building_available->merge($buildings);


        return $buildings;
    }

    public function create(Request $request,City $city)
    {
        //Create Building
        $this->authorize('isMyCity',$city);
        $request->validate(['position' => 'required|numeric|min:1|max:15','building'=>'required|numeric|min:1']);

        $nextLevel = BuildingLevel::where('building_id',$request->input('building'))->where('level',1)->first();
        $ceroLevel = BuildingLevel::where('building_id',$request->input('building'))->where('level',0)->first();

        if($nextLevel==NULL)
        {
            return 'Este edificio no existe';
        }

        if(!BuildingHelper::checkResearch($request->input('building')))
        {
            return 'No tienes la investigacion necesaria para construir este edificio';
        }

        BuildingHelper::updateConstructedTime($city->id);

        if(BuildingHelper::isContructed($city))
        {
            return 'Estas construyendo algo en esta ciudad';
        }

        if(BuildingHelper::positionExist($city,$request->input('position')))
        {
            return 'Ya hay un edificio en esta posicion';
        }

        if(BuildingHelper::buildingExist($city,$request->input('building')))
        {
            return 'El edificio ya esta construido en otra posicion';
        }

        //Verificar que no pueda construir un edificio de produccion de otro recurso
        if($request->input('building')>=12&&$request->input('building')<=18)
        {
            $insland_type = $city->islandCity->island->type;
            $userCity = UserCity::where('user_id',Auth::id())->where('city_id',$city->id)->first();
            switch($request->input('building')){
                case 12://Soplador de vidrio
                    if($insland_type!=3)
                    {
                        return 'No puedes construir este edificio en esta isla';
                    }
                break;
                case 13://Torre del alquimista
                    if($insland_type!=4)
                    {
                        return 'No puedes construir este edificio en esta isla';
                    }
                break;
                case 14://Vinocultor
                    if($insland_type!=1)
                    {
                        return 'No puedes construir este edificio en esta isla';
                    }
                break;
                case 15://Cantero
                    if($insland_type!=2)
                    {
                        return 'No puedes construir este edificio en esta isla';
                    }
                break;
                case 17://Palacio
                    if(!$userCity->capital==1)
                    {
                        return 'Solo puedes construir este edificio en la capital';
                    }
                break;
                case 18://Residencia
                    if(!$userCity->capital==0)
                    {
                        return 'Solo puedes construir este edificio en las colonias';
                    }
                break;
            }
        }


        //Aplicamos descuentos de investigaciones y edificios
        BuildingHelper::lessBuildingCost($city,$nextLevel);

        //Compare if user have resources for upgrade and constructed building
        if(CityHelper::compareResources($city,$nextLevel))
        {
            CityHelper::removeResources($city,$nextLevel);

            //Upgrade building
            $cityBuilding = new CityBuilding();
            $cityBuilding->city_id = $city->id;
            $cityBuilding->position = $request->input('position');
            $cityBuilding->building_level_id = $ceroLevel->id;
            $cityBuilding->constructed_at = Carbon::now()->addSeconds($nextLevel->time);
            $cityBuilding->save();

            return 'ok';
        }
        else
        {
            return 'No tienes recursos';
        }
    }

    public function nextLevel(Request $request,Building $building)
    {
        //Obtiene la informacion del siguiente nivel de edificio
        $request->validate(['level' => 'required|integer|min:1']);
        $nextLevel = BuildingLevel::where('building_id',$building->id)->where('level',$request->input('level')+1)->first();
        if($nextLevel===NULL){
            $nextLevel = BuildingLevel::where('building_id',$building->id)->where('level',$request->input('level'))->first();
            $nextLevel['maximum'] = true;
        }
        if($building->id==4)
        {
            $nextLevel['units'] = Unit::selectRaw('id,population,wood,wine,glass,sulfur,time,barrack_level,gold,0 as trainer')->get();
        }
        return $nextLevel;
    }

    public function upgrade(CityBuilding $cityBuilding)
    {
        //Upgrade building
        $this->authorize('update',$cityBuilding);
        $city = City::whereId($cityBuilding->city_id)->first();

        $nowLevel = $cityBuilding->building_level;
        $nextLevel = BuildingLevel::where('building_id',$nowLevel->building_id)->where('level',$nowLevel->level+1)->first();

        if($nextLevel == NULL)
        {
            return 'No existe ese nivel';
        }

        BuildingHelper::updateConstructedTime($city->id);

        if(BuildingHelper::isContructed($city))
        {
            return 'Estas construyendo algo en esta ciudad';
        }

        //Aplicamos descuentos de investigaciones y edificios
        BuildingHelper::lessBuildingCost($city,$nextLevel);

        //Compare if user have resources for upgrade and constructed building
        if(CityHelper::compareResources($city,$nextLevel))
        {
            CityHelper::removeResources($city,$nextLevel);

            //Upgrade building
            //$cityBuilding->building_level_id = $nextLevel->id;
            $cityBuilding->constructed_at = Carbon::now()->addSeconds($nextLevel->time);
            $cityBuilding->save();

            return 'ok';
        }
        else
        {
            return 'No tienes recursos';
        }
    }
}
