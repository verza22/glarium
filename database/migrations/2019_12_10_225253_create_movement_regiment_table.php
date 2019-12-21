<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMovementRegimentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movement_regiment', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('movement_id');
            $table->unsignedBigInteger('regiment_id');
            $table->integer('size');

            $table->foreign('movement_id')->references('id')->on('movement');
            $table->foreign('regiment_id')->references('id')->on('regiment');
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
        Schema::dropIfExists('movement_regiment');
        Schema::enableForeignKeyConstraints();
    }
}
