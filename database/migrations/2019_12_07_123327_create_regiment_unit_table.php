<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegimentUnitTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('regiment_unit', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('regiment_id');
            $table->unsignedBigInteger('unit_id');
            $table->integer('cant');

            $table->foreign('regiment_id')->references('id')->on('regiment');
            $table->foreign('unit_id')->references('id')->on('unit');
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
        Schema::dropIfExists('regiment_unit');
        Schema::enableForeignKeyConstraints();
    }
}
