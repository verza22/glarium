<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCombatReportTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('combat_report', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->unsignedBigInteger('movement_regiment_id');
            $table->integer('result');//0 indeterminado error--1 gano atacante--2 gano defensor

            $table->foreign('movement_regiment_id')->references('id')->on('movement_regiment');
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
        Schema::dropIfExists('combat_report');
        Schema::enableForeignKeyConstraints();
    }
}
