# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# custom processors for thumbnail generation

from PIL import Image


def scale_and_pad(im, requested_size, opts):
    if opts.get('pad') or 'pad' in opts:
        x, y = [float(v) for v in im.size]
        xr, yr = [float(v) for v in requested_size]

        #smallest enlargement that will make it touch the requested box
        r = min(xr / x, yr / y)

        im = im.resize((int(x * r), int(y * r)), resample=Image.ANTIALIAS)

        # now pad with white where we do not fill requested box
        # may need color value, not name, depending on PIL version
        im2 = Image.new("RGB", requested_size, "white")

        # Difference (for x and y) between new image size and requested size.
        x, y = [float(v) for v in im.size]
        dx, dy = (xr - x), (yr - y)
        ex, ey = dx / 2, dy / 2
        box = [int(ex), int(ey), int(x + ex), int(y + ey)]

        # Finally, copy the image content
        im2.paste(im, box)
        return im2
    return im

scale_and_pad.valid_options = ('pad',)
