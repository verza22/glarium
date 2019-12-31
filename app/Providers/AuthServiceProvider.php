<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\UserCity;
use App\Models\Movement;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Models\CityBuilding' => 'App\Policies\CityBuildingPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        Gate::define('isMyCity', function ($user,$city) {
            return UserCity::where('user_id',$user->id)->where('city_id',$city->id)->whereHas('city',function($query){
                $query->whereNotNull('constructed_at');
            })->exists();
        });
        Gate::define('isNotMyCity', function ($user,$city) {
            return UserCity::where('user_id',$user->id)->where('city_id',$city->id)->count() === 0;
        });
        Gate::define('myMovement', function ($user,$movement) {
            return Movement::whereId($movement->id)->where('user_id',$user->id)->exists();
        });
    }
}
