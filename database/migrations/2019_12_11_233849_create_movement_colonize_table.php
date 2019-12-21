<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMovementColonizeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movement_colonize', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->softDeletes();
            $table->dateTime('start_at')->nullable();
            $table->dateTime('end_at')->nullable();

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('city_from');
            $table->unsignedBigInteger('island_to');
            $table->integer('position');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('city_from')->references('id')->on('city');
            $table->foreign('island_to')->references('id')->on('island');
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
        Schema::dropIfExists('movement_colonize');
        Schema::enableForeignKeyConstraints();
    }
}
