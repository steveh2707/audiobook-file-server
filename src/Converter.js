import { spawnSync } from 'child_process';

export class Converter {
    setUpShell() {
        const command = `alias m4b-tool='docker run -it --rm -u $(id -u):$(id -g) -v "$(pwd)":/mnt sandreas/m4b-tool'`
        console.log(command)
        const result = spawnSync(command, {
            shell: true,
            stdio: 'inherit',
            encoding: 'utf-8'
        });

        if (result.error) {
            console.error('Error executing command:', result.error);
        } else {
            console.log('stdout:', result.stdout);
            console.error('stderr:', result.stderr);
        }
    }

    mergeAndConvertToM4B(path, name) {
        console.log(`Converting: ${path}/${name}`)

        const command = `(cd ../app && m4b-tool merge "${path}" --output-file="${name}.m4b")`
        console.log(command)
        // const command = 'm4b-tool';
        // const args = [
        //     'merge',
        //     path,
        //     `--output-file=${path}/${name}.m4b`,
        //     '--jobs=4'
        // ];

        // const result = spawnSync(command, args, { encoding: 'utf-8' });
        // const result = spawnSync('ls', ['-l', '/usr'], { encoding : 'utf8' });
        // const result = spawnSync(command, { encoding: 'utf-8' });
        const result = spawnSync(command, {
            shell: true,
            stdio: 'inherit',
            encoding: 'utf-8'
        });

        if (result.error) {
            console.error('Error executing command:', result.error);
        } else {
            console.log('stdout:', result.stdout);
            console.error('stderr:', result.stderr);
        }

        console.log(`Conversion Successful: ${path}/${name}`)
    }
}