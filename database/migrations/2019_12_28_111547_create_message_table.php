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
            $table->unsignedBigInteger('user_from');
            $table->unsignedBigInteger('user_to');
            $table->integer('type');
            $table->text('message');

            $table->foreign('user_from')->references('id')->on('users');
            $table->foreign('user_to')->references('id')->on('users');
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
