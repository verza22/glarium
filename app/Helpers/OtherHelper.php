<?php

namespace App\Helpers;

use App\User;
use App\Models\City;
use App\Models\UserCity;
use App\Models\CityBuilding;
use App\Models\CityPopulation;
use App\Models\IslandCity;
use App\Models\UserResource;
use App\Models\IslandDonation;
use DB;

class OtherHelper
{

    public static function generateIslands()
    {
        $probabilidad1 = 40;
        $probabilidad2 = 75;
        for ($y = 0; $y < 100; $y++) {
            for ($x = 0; $x < 100; $x++) {
                $aux = Rand(1, 100);
                $probabilidad = $x % 2 == 0 ? $probabilidad2 : $probabilidad1;
                $probabilidad = $y % 2 == 0 ? $probabilidad2 : $probabilidad1;
                if ($probabilidad > $aux) {
                    $data[$x][$y]['tipo'] = 'o';
                } else {
                    $data[$x][$y]['tipo'] = 'i';
                    $data[$x][$y]['resource'] = Rand(1, 4);
                }
            }
        }
        self::setSzone($data);
        return $data;
        //self::grafique($data);
    }

    private static function setSzone(&$data)
    {
        for ($y = 0; $y < 100; $y++) {
            for ($x = 0; $x < 100; $x++) {
                if ($y < 10) {
                    $numbers = [91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
                } elseif ($y >= 10 && $y < 20) {
                    $numbers = [90, 57, 58, 59, 60, 61, 62, 63, 64, 65];
                } elseif ($y >= 20 && $y < 30) {
                    $numbers = [89, 56, 31, 32, 33, 34, 35, 36, 37, 66];
                } elseif ($y >= 30 && $y < 40) {
                    $numbers = [88, 55, 30, 13, 14, 15, 16, 17, 38, 67];
                } elseif ($y >= 40 && $y < 50) {
                    $numbers = [87, 54, 29, 12, 1, 2, 5, 18, 39, 68];
                } elseif ($y >= 50 && $y < 60) {
                    $numbers = [86, 53, 28, 11, 3, 4, 6, 19, 40, 69];
                } elseif ($y >= 60 && $y < 70) {
                    $numbers = [85, 52, 27, 10, 9, 8, 7, 20, 41, 70];
                } elseif ($y >= 70 && $y < 80) {
                    $numbers = [84, 51, 26, 25, 24, 23, 22, 21, 42, 71];
                } elseif ($y >= 80 && $y < 90) {
                    $numbers = [83, 50, 49, 48, 47, 46, 45, 44, 43, 72];
                } else {
                    $numbers = [82, 81, 80, 79, 78, 77, 76, 75, 74, 73];
                }
                self::callx($x, $y, $data, $numbers);
            }
        }
    }

    private static function callx($x, $y, &$data, $numbers)
    {
        if ($x < 10) {
            $data[$x][$y]['sector'] = $numbers[0];
        } elseif ($x >= 10 && $x < 20) {
            $data[$x][$y]['sector'] = $numbers[1];
        } elseif ($x >= 20 && $x < 30) {
            $data[$x][$y]['sector'] = $numbers[2];
        } elseif ($x >= 30 && $x < 40) {
            $data[$x][$y]['sector'] = $numbers[3];
        } elseif ($x >= 40 && $x < 50) {
            $data[$x][$y]['sector'] = $numbers[4];
        } elseif ($x >= 50 && $x < 60) {
            $data[$x][$y]['sector'] = $numbers[5];
        } elseif ($x >= 60 && $x < 70) {
            $data[$x][$y]['sector'] = $numbers[6];
        } elseif ($x >= 70 && $x < 80) {
            $data[$x][$y]['sector'] = $numbers[7];
        } elseif ($x >= 80 && $x < 90) {
            $data[$x][$y]['sector'] = $numbers[8];
        } else {
            $data[$x][$y]['sector'] = $numbers[9];
        }
    }

    public static function newPlayer(User $user)
    {
        //Creamos los recursos del jugador
        UserResource::create(['user_id' => $user->id]);

        //Obtenemos la primera isla que este vacia
        $island_id = DB::table('island as i')
            ->leftJoin('island_city as c', 'c.island_id', '=', 'i.id')
            ->groupBy('i.id')
            ->havingRaw('count(i.id) < 10')
            ->selectRaw('i.id')
            ->first()->id;

        //Obtenemos la posicion de esa isla
        $citys = IslandCity::whereId($island_id)->get();
        for($i=0;$i<16;$i++)
        {
            if($citys->where('position',$i)->count()==0)
            {
                $position = $i;
                break;
            }
        }

        return self::createCity($user,$island_id,$position,true);
    }

    public static function createCity(User $user,$island_id,$position,$capital = false)
    {
        //Create new city
        $city = City::create();
        UserCity::create(['user_id' => $user->id, 'city_id' => $city->id, 'capital' => $capital]);

        IslandCity::create(['island_id' => $island_id, 'city_id' => $city->id, 'position' => $position]);

        IslandDonation::create(['island_id' => $island_id, 'city_id' => $city->id, 'type' => 0]);
        IslandDonation::create(['island_id' => $island_id, 'city_id' => $city->id, 'type' => 1]);

        //Creamos la poblacion
        CityPopulation::create(['city_id' => $city->id]);

        //Create town hall
        CityBuilding::create(['building_level_id' => 1, 'city_id' => $city->id, 'position' => 0]);

        return $city->id;
    }
}
