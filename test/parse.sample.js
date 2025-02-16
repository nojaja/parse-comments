'use strict';

require('mocha');
const assert = require('assert');
const Comments = require('..');
const extract = require('extract-comments');

/**
 * Some of these tests are based on tests from doctrine
 * https://github.com/eslint/doctrine/LICENSE.BSD
 * https://github.com/eslint/doctrine/LICENSE.closure-compiler
 * https://github.com/eslint/doctrine/LICENSE.esprima
 */

describe('parse inline tags', () => {
  beforeEach(function() {
  });

  describe('comment description', () => {
    it('in-line comments', () => {
      let comments = new Comments( {commentStart: '/*', commentEnd: '*/', allowSingleStar: true ,allowLineComment: true , extract:(str, opts)=>{
        comments = extract(str, opts);
        return comments
      }});
      let res = comments.parse([
          '// Prevents the default action. It is equivalent to',
          '// `{@code e.preventDefault()}`, but can be used as the callback argument of',
          '// `{@link goog.events.listen}` without declaring another function.',
          '// @param {!goog.events.Event} e An event.',
          '// @param {@link Data}',
          '// @param {/ab/cd}',
          '// @return {@link Data}',
          'hoge()'
        ].join('\n'), { unwrap: true });
        //console.log("res:",JSON.stringify(res,null,"\t"))
      assert.equal(res[0].description, 'Prevents the default action. It is equivalent to');
      assert.deepEqual(res[3].tags, [
        {
          title: 'param',
          description: 'An event.',
          inlineTags: [],
          type: {
            type: 'NonNullableType',
            expression: {
              type: 'NameExpression',
              name: 'goog.events.Event'
            },
            prefix: true
          },
          name: 'e'
        }
      ]);

      assert.deepEqual(res[0].inlineTags, []);
    });

    it('at comments', () => {
      let comments = new Comments( {commentStart: '/*', commentEnd: '*/', allowSingleStar: true ,allowLineComment: true , extract:(str, opts)=>{
        comments = extract(str, opts);
        return comments
      }});
      let res = comments.parse([
          '// @',
          '// @ 2022-01-01',
          'hoge()'
        ].join('\n'), { unwrap: true });
        console.log("res:",JSON.stringify(res,null,"\t"))
      assert.equal(res[0].description, '@');
      assert.equal(res[1].description, '@ 2022-01-01');
    });

  });

});
