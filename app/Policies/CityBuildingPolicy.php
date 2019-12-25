<?php

namespace App\Policies;

use App\Models\CityBuilding;
use App\User;
use App\Models\City;
use App\Models\UserCity;
use Illuminate\Auth\Access\HandlesAuthorization;

class CityBuildingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any city buildings.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the city building.
     *
     * @param  \App\User  $user
     * @param  \App\CityBuilding  $cityBuilding
     * @return mixed
     */
    public function view(User $user, CityBuilding $cityBuilding)
    {
        //
    }

    /**
     * Determine whether the user can create city buildings.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user,City $city)
    {
        return UserCity::where('user_id',$user->id)->where('city_id',$city->id)->exists();
    }

    /**
     * Determine whether the user can update the city building.
     *
     * @param  \App\User  $user
     * @param  \App\CityBuilding  $cityBuilding
     * @return mixed
     */
    public function update(User $user, CityBuilding $cityBuilding)
    {
        return UserCity::where('user_id',$user->id)->where('city_id',$cityBuilding->city_id)->exists();
    }

    /**
     * Determine whether the user can delete the city building.
     *
     * @param  \App\User  $user
     * @param  \App\CityBuilding  $cityBuilding
     * @return mixed
     */
    public function delete(User $user, CityBuilding $cityBuilding)
    {
        //
    }

    /**
     * Determine whether the user can restore the city building.
     *
     * @param  \App\User  $user
     * @param  \App\CityBuilding  $cityBuilding
     * @return mixed
     */
    public function restore(User $user, CityBuilding $cityBuilding)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the city building.
     *
     * @param  \App\User  $user
     * @param  \App\CityBuilding  $cityBuilding
     * @return mixed
     */
    public function forceDelete(User $user, CityBuilding $cityBuilding)
    {
        //
    }
}
