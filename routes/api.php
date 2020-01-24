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

Route::get('buildings', 'Game\BuildingController@buildings');
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
Route::get('user/unread', 'Game\UserController@unread');
Route::get('user/getMayor', 'Game\UserController@getMayor');
Route::post('user/getMessages', 'Game\UserController@getMessages');
Route::post('user/buyTradeShip', 'Game\UserController@buyTradeShip');
Route::post('user/sendMessage/{city}', 'Game\UserController@sendMessage');
Route::post('user/message', 'Game\UserController@deleteMessage');
Route::put('user/readMessages', 'Game\UserController@readMessages');
Route::put('user/readMessage/{message}', 'Game\UserController@readMessage');

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
Route::delete('movement/{movement}', 'Game\MovementController@remove');

Route::get('world/{x}/{y}', 'Game\WorldController@index');

Route::post('unit/{city}','Game\UnitController@create');
Route::get('unit','Game\UnitController@index');
