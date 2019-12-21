<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResearchUnitTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('research_unit', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('unit_id');
            $table->unsignedBigInteger('research_id');

            $table->foreign('unit_id')->references('id')->on('unit');
            $table->foreign('research_id')->references('id')->on('research');
        });

        /*DB::table('research_unit')->insert(
            array(
                array('unit_id' => 3,'research_id' => 19),
                array('unit_id' => 4,'research_id' => 19),
                array('unit_id' => 5,'research_id' => 22),
                array('unit_id' => 6,'research_id' => 26),
                array('unit_id' => 7,'research_id' => 27),
                array('unit_id' => 8,'research_id' => 20),
                array('unit_id' => 9,'research_id' => 23),
                array('unit_id' => 10,'research_id' => 28)
            )
        );*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('research_unit');
        Schema::enableForeignKeyConstraints();
    }
}
