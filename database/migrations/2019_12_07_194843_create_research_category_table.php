<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateResearchCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('research_category', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
        });

        DB::table('research_category')->insert(
            array(
                array('name'  => 'Seafaring'),
                array('name'  => 'Economy'),
                array('name'  => 'Science'),
                array('name'  => 'Military')
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
        Schema::dropIfExists('research_category');
        Schema::enableForeignKeyConstraints();
    }
}
