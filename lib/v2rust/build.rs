extern crate napi_build;
use cc;
use std::env;

fn main() {
    let out_dir = env::var("OUT_DIR").unwrap();
    println!("cargo:rerun-if-changed=src/hessian/fast_memcpy.c");

    // Tell Cargo that if the given file changes, to rerun this build script.
    // Use the `cc` crate to build a C file and statically link it.
    cc::Build::new()
        .flag("-msse2")
        .file("src/hessian/fast_memcpy.c")
        .compile("fast_memcpy");
    println!("cargo:rustc-link-search=native={}", out_dir);
    println!("cargo:rustc-link-lib=static=fast_memcpy");
    napi_build::setup();
}