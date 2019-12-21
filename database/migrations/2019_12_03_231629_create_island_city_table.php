<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIslandCityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('island_city', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->softDeletes();	
            $table->unsignedBigInteger('island_id');
            $table->unsignedBigInteger('city_id');
            $table->integer('position');

            $table->foreign('island_id')->references('id')->on('island');
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
        Schema::dropIfExists('island_city');
        Schema::enableForeignKeyConstraints();
    }
}
