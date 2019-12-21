<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCityPopulationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('city_population', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->unsignedBigInteger('city_id');
            $table->integer('population_max');
            $table->float('population',8,4);
            $table->integer('worker_forest');
            $table->integer('worker_mine');
            $table->integer('wine_max');
            $table->integer('wine');
            $table->integer('scientists_max');
            $table->integer('scientists');

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
        Schema::dropIfExists('city_population');
        Schema::enableForeignKeyConstraints();
    }
}
