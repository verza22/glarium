<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMovementTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movement', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->softDeletes();
            $table->dateTime('start_at')->nullable();
            $table->dateTime('end_at')->nullable();
            $table->dateTime('return_at')->nullable();

            $table->boolean('delivered');

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('city_from');
            $table->unsignedBigInteger('city_to');
            $table->unsignedBigInteger('movement_type_id');

            $table->integer('trade_ship');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('city_from')->references('id')->on('city');
            $table->foreign('city_to')->references('id')->on('city');
            $table->foreign('movement_type_id')->references('id')->on('movement_type');
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
        Schema::dropIfExists('movement');
        Schema::enableForeignKeyConstraints();
    }
}
