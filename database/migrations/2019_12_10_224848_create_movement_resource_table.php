<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMovementResourceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movement_resource', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('movement_id');
            $table->integer('wood');
            $table->integer('wine');
            $table->integer('marble');
            $table->integer('glass');
            $table->integer('sulfur');

            $table->foreign('movement_id')->references('id')->on('movement');
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
        Schema::dropIfExists('movement_resource');
        Schema::enableForeignKeyConstraints();
    }
}
