<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('city', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->softDeletes();
            $table->string('name',50);
            $table->float('wood',200,4);
            $table->float('wine',200,4);
            $table->float('marble',200,4);
            $table->float('glass',200,4);
            $table->float('sulfur',200,4);
            $table->integer('apoint');
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
        Schema::dropIfExists('city');
        Schema::enableForeignKeyConstraints();
    }
}
