<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCombatReportDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('combat_report_detail', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->unsignedBigInteger('combat_report_id');
            $table->integer('round');
            $table->integer('type_attack');
            $table->integer('result');
            $table->unsignedBigInteger('attack_unit_id');
            $table->integer('attack_before_cant');
            $table->integer('attack_after_cant');
            $table->unsignedBigInteger('defense_unit_id');
            $table->integer('defense_before_cant');
            $table->integer('defense_after_cant');

            $table->foreign('combat_report_id')->references('id')->on('combat_report');
            $table->foreign('attack_unit_id')->references('id')->on('unit');
            $table->foreign('defense_unit_id')->references('id')->on('unit');
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
        Schema::dropIfExists('combat_report_detail');
        Schema::enableForeignKeyConstraints();
    }
}
