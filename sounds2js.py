import os
import base64

images_path = './sounds/'

for filename in os.listdir(images_path):
    file_name = os.path.join(images_path, filename)

    if file_name.upper().endswith('MP3'):
        print 'MP3', file_name

        output = open(os.path.join(images_path, filename + '.js'), 'w')
        output.write('define(function (require) {\n')
        output.write('\n')

        content = file(file_name).read()

        output.write("return 'data:audio/mpeg3;base64,%s';\n" %
                     base64.b64encode(content))
        output.write('});')
        output.close()


