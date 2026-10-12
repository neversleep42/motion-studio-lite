import test from 'node:test';import assert from 'node:assert/strict';
import {validateCode,validId} from '../server/source';import {examples} from '../src/examples';
test('les trois exemples sont acceptés',()=>{for(const e of examples)assert.equal(validateCode(e.code),e.code);});
test('les imports système, externes et dynamiques sont refusés',()=>{for(const code of ["import x from 'node:fs'","import x from '../secret'","import('react')","require('fs')"] )assert.throws(()=>validateCode(code));});
test('les données et chemins invalides sont refusés',()=>{assert.throws(()=>validateCode(null));assert.throws(()=>validateCode('x'.repeat(40001)));assert.equal(validId('../secret'),false);assert.equal(validId('532c8d93-b3ad-4bec-bfb7-0de73ece0cd2'),true);});
