<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('message', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->dateTime('deleted_at_from')->nullable();
            $table->dateTime('deleted_at_to')->nullable();
            $table->unsignedBigInteger('city_from');
            $table->unsignedBigInteger('city_to');
            $table->integer('type');
            $table->integer('readed');
            $table->text('message');

            $table->foreign('city_from')->references('id')->on('city');
            $table->foreign('city_to')->references('id')->on('city');
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
        Schema::dropIfExists('message');
        Schema::enableForeignKeyConstraints();
    }
}
