var child_process = require('child_process');
var fs = require('fs');
var path = require('path');

var async = require('async');
var regedit = require('regedit');

function enquot( string ) {
  return "\""+ string.replace(/"/g, '\\\"') +"\"";
}

var args = process.argv;
if( args[0] !== 'sas' ){
  // asume it starts with node.js sas
  args = args.slice(1);
}

if( args.length < 3 ){
  console.log('usage : sas service_name service_script_file_path [args]');
  return;
}



var exec_name = args[1];
var exec_file = path.join( process.cwd(), args[2]);
var service_reg_key = 'HKLM\\System\\CurrentControlSet\\Services\\' + exec_name + '\\Parameters';
var node_path

async.waterfall([function( done ) {
    // get node path
    child_process.exec('where node',function( err, stdout ) {
      if( err ){ 
        done(err);
        return;
      }
      node_path = stdout.trim();
      done(null);
    });
  },
  function( done ) {
    var srvany = enquot("D:\\Program Files\\Windows Resource Kits\\Tools\\srvany.exe")
    var sc_create_cmd = 'sc create ' + exec_name + ' binPath= "' + srvany + '" ';

    console.log( sc_create_cmd );
    child_process.exec(sc_create_cmd,function( err, stdout, stderr ) {
      if( err ){ 
        done(err);
        return;
      }
      console.log( stdout, stderr );
      done();
    });
  },
  function( done ) {
    regedit.createKey([service_reg_key], done);
  },
  function( done ) {
    var regedit_optn = {};
    var application = [enquot(node_path), enquot(exec_file)].concat(args.slice(3)).join(' ');

    regedit_optn[service_reg_key] = {
      'Application' : {
        value: application,
        type: 'REG_SZ'
      }
    };

    regedit.putValue(regedit_optn, done);

  }],
  function(err) {
    if( err ){
      return;
    }
    console.log( 'setup success' );
  })