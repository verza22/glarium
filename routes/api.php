<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
  //  return $request->user();
//});

Route::get('building/{city}', 'Game\BuildingController@buildings');
Route::post('building/nextLevel/{building}', 'Game\BuildingController@nextLevel');
Route::post('building/{city}', 'Game\BuildingController@buildingsAvaible');
Route::put('building/upgrade/{cityBuilding}', 'Game\BuildingController@upgrade');
Route::put('building/{city}', 'Game\BuildingController@create');

Route::get('city/getResources/{city}', 'Game\CityController@getResources');
Route::get('city/getPopulation/{city}', 'Game\CityController@getPopulation');
Route::get('city/getActionPoint/{city}', 'Game\CityController@getActionPoint');
Route::get('city/getCities', 'Game\CityController@getCities');
Route::post('city/setScientists/{city}', 'Game\CityController@setScientists');

Route::get('user/getUserResources', 'Game\UserController@getUserResources');
Route::get('user/config', 'Game\UserController@config');
Route::post('user/buyTradeShip', 'Game\UserController@buyTradeShip');
Route::post('user/sendMessage/{user}', 'Game\UserController@sendMessage');

Route::post('island/donation/{island}', 'Game\IslandController@donation');
Route::put('island/donation/{island}', 'Game\IslandController@setDonation');
Route::post('island/setWorker/{city}', 'Game\IslandController@setWorker');
Route::get('island/{island}', 'Game\IslandController@show');

Route::get('research', 'Game\ResearchController@getData');
Route::post('research/{research}', 'Game\ResearchController@create');
