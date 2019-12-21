<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableCityBuilding extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('city_building', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->softDeletes();
            $table->dateTime('constructed_at')->nullable();
            $table->unsignedBigInteger('building_level_id');
            $table->unsignedBigInteger('city_id');
            $table->integer('position');

            $table->foreign('building_level_id')->references('id')->on('building_level');
            $table->foreign('city_id')->references('id')->on('city');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('city_building');
        Schema::enableForeignKeyConstraints();
    }
}
