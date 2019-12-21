<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateResearchBuildingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('research_building', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('building_id');
            $table->unsignedBigInteger('research_id');

            $table->foreign('building_id')->references('id')->on('building');
            $table->foreign('research_id')->references('id')->on('research');
        });

        DB::table('research_building')->insert(
            array(
                array('building_id' => 3,'research_id' => 2),
                array('building_id' => 5,'research_id' => 5),
                array('building_id' => 6,'research_id' => 1),
                array('building_id' => 7,'research_id' => 15),
                array('building_id' => 8,'research_id' => 24),
                array('building_id' => 9,'research_id' => 11),
                array('building_id' => 10,'research_id' => 8),
                array('building_id' => 11,'research_id' => 6),
                array('building_id' => 12,'research_id' => 6),
                array('building_id' => 13,'research_id' => 6),
                array('building_id' => 14,'research_id' => 6),
                array('building_id' => 15,'research_id' => 6),
                array('building_id' => 17,'research_id' => 29),
                array('building_id' => 18,'research_id' => 29)
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('research_building');
        Schema::enableForeignKeyConstraints();
    }
}
