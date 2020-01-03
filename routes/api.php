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
Route::post('city/setWine/{city}', 'Game\CityController@setWine');
Route::post('city/setName/{city}', 'Game\CityController@setName');

Route::get('user/getUserResources', 'Game\UserController@getUserResources');
Route::get('user/config', 'Game\UserController@config');
Route::get('user/getMessage', 'Game\UserController@getMessage');
Route::get('user/getMayor', 'Game\UserController@getMayor');
Route::post('user/buyTradeShip', 'Game\UserController@buyTradeShip');
Route::post('user/sendMessage/{user}', 'Game\UserController@sendMessage');
Route::post('user/message', 'Game\UserController@deleteMessage');

Route::post('island/donation/{island}', 'Game\IslandController@donation');
Route::put('island/donation/{island}', 'Game\IslandController@setDonation');
Route::post('island/setWorker/{city}', 'Game\IslandController@setWorker');
Route::get('island/{island}', 'Game\IslandController@show');

Route::get('research', 'Game\ResearchController@getData');
Route::post('research/{research}', 'Game\ResearchController@create');

Route::get('movement', 'Game\MovementController@getMovement');
Route::put('movement', 'Game\MovementController@endMovement');
Route::post('movement/colonize/{city}', 'Game\MovementController@colonize');
Route::post('movement/transport/{city}', 'Game\MovementController@transport');
