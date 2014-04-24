/**!
 * hessian.js - test/object.test.js
 *
 * Copyright(c) 2014
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var hessian = require('../');
var utils = require('./utils');

describe('object.test.js', function () {
  describe('v2.0', function () {
    it('should write enum Color', function () {
      hessian.encode({
        $class: 'hessian.Main$Color',
        $: {
          name: 'RED'
        }
      }, '2.0').should.eql(utils.bytes('v2/enum/red'));

      hessian.encode({
        $class: 'hessian.Main$Color',
        $: {
          name: 'GREEN'
        }
      }, '2.0').should.eql(utils.bytes('v2/enum/green'));

      hessian.encode({
        $class: 'hessian.Main$Color',
        $: {
          name: 'BLUE'
        }
      }, '2.0').should.eql(utils.bytes('v2/enum/blue'));
    });

    it('should write enum with ref', function () {
      // list = new ArrayList();
      // list.add(Color.BLUE);
      // list.add(Color.RED);
      // list.add(Color.GREEN);
      hessian.encode([
        {
          $class: 'hessian.Main$Color',
          $: {
            name: 'BLUE'
          }
        },
        {
          $class: 'hessian.Main$Color',
          $: {
            name: 'RED'
          }
        },
        {
          $class: 'hessian.Main$Color',
          $: {
            name: 'GREEN'
          }
        },
      ], '2.0').should.eql(utils.bytes('v2/enum/lists'));
    });

    it('should read enum Color', function () {
      // enum Color {
      //   RED,
      //   GREEN,
      //   BLUE,
      // }

      // enum format:
      // O type 1 "name" o ref name-value
      hessian.decode(utils.bytes('v2/enum/red'), '2.0').should.eql({
        name: 'RED'
      });

      hessian.decode(utils.bytes('v2/enum/green'), '2.0', true).should.eql({
        $class: 'hessian.Main$Color',
        $: {
          name: 'GREEN'
        }
      });

      hessian.decode(utils.bytes('v2/enum/blue'), '2.0').should.eql({
        name: 'BLUE'
      });

      hessian.decode(utils.bytes('v2/enum/green'), '2.0').should.eql({
        name: 'GREEN'
      });

      hessian.decode(utils.bytes('v2/enum/red'), '2.0', true).should.eql({
        $class: 'hessian.Main$Color',
        $: {
          name: 'RED'
        }
      });

      hessian.decode(utils.bytes('v2/enum/lists'), '2.0').should.eql(
        [ { name: 'BLUE' }, { name: 'RED' }, { name: 'GREEN' } ]
      );

      hessian.decode(utils.bytes('v2/enum/lists'), '2.0', true).should.eql([
        { '$class': 'hessian.Main$Color', '$': { name: 'BLUE' } },
        { '$class': 'hessian.Main$Color', '$': { name: 'RED' } },
        { '$class': 'hessian.Main$Color', '$': { name: 'GREEN' } }
      ]);
    });

    it('should write "{$class: "hessian.test.demo.Car", $: {a: 1}}"', function () {
      var obj = {
        $class: 'hessian.test.demo.Car',
        $: {a: 1, b: 'map'}
      };
      var buf = hessian.encode(obj, '2.0');
      buf[0].should.equal(0x4f);
      hessian.decode(buf, '2.0').should.eql(obj.$);
      hessian.decode(buf, '2.0', true).should.eql(obj);
    });

    it('should read one car list', function () {
      hessian.decode(utils.bytes('v2/map/one_car_list'), '2.0').should.eql([
        { a: 'a',
          c: 'c',
          b: 'b',
          model: 'model 1',
          color: 'aquamarine',
          mileage: 65536 }
      ]);

      var cars = hessian.decode(utils.bytes('v2/map/one_car_list'), '2.0', true);
      cars.should.eql([
        {
          $class: 'hessian.demo.Car',
          $: {
            a: 'a',
            c: 'c',
            b: 'b',
            model: 'model 1',
            color: 'aquamarine',
            mileage: 65536 }
        }
      ]);

      hessian.encode(cars, '2.0').should.eql(utils.bytes('v2/map/one_car_list'));
    });

    it('should read two car list', function () {
      hessian.decode(utils.bytes('v2/map/two_car_list'), '2.0').should.eql([
        { a: 'a',
          c: 'c',
          b: 'b',
          model: 'model 1',
          color: 'aquamarine',
          mileage: 65536 },
        { a: 'a',
          c: 'c',
          b: 'b',
          model: 'model 2',
          color: 'aquamarine',
          mileage: 65536 }
      ]);

      var cars = hessian.decode(utils.bytes('v2/map/two_car_list'), '2.0', true);
      cars.should.eql([
        {
          $class: 'hessian.demo.Car',
          $: {
            a: 'a',
            c: 'c',
            b: 'b',
            model: 'model 1',
            color: 'aquamarine',
            mileage: 65536 }
        },
        {
          $class: 'hessian.demo.Car',
          $: {
            a: 'a',
            c: 'c',
            b: 'b',
            model: 'model 2',
            color: 'aquamarine',
            mileage: 65536 }
        }
      ]);

      var buf = hessian.encode(cars, '2.0');
      buf.should.length(utils.bytes('v2/map/two_car_list').length);
      buf.should.eql(utils.bytes('v2/map/two_car_list'));
    });

    it('should read many cars', function () {
      // list = new ArrayList();
      // list.add(new Car("model 1"));
      // list.add(new Car("model 2"));
      // list.add(new Car("model 3"));
      hessian.decode(utils.bytes('v2/map/car_list'), '2.0').should.eql([
        { a: 'a',
          c: 'c',
          b: 'b',
          model: 'model 1',
          color: 'aquamarine',
          mileage: 65536 },
        { a: 'a',
          c: 'c',
          b: 'b',
          model: 'model 2',
          color: 'aquamarine',
          mileage: 65536 },
        { a: 'a',
          c: 'c',
          b: 'b',
          model: 'model 3',
          color: 'aquamarine',
          mileage: 65536 }
      ]);

      var cars = hessian.decode(utils.bytes('v2/map/car_list'), '2.0', true);
      cars.should.eql([
        { '$class': 'hessian.demo.Car',
          '$':
           { a: 'a',
             c: 'c',
             b: 'b',
             model: 'model 1',
             color: 'aquamarine',
             mileage: 65536 } },
        { '$class': 'hessian.demo.Car',
          '$':
           { a: 'a',
             c: 'c',
             b: 'b',
             model: 'model 2',
             color: 'aquamarine',
             mileage: 65536 } },
        { '$class': 'hessian.demo.Car',
          '$':
           { a: 'a',
             c: 'c',
             b: 'b',
             model: 'model 3',
             color: 'aquamarine',
             mileage: 65536 } }
      ]);

      hessian.encode(cars, '2.0').should.eql(utils.bytes('v2/map/car_list'));
    });
  });
});
