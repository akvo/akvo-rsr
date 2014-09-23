# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.http import HttpResponseRedirect
from .models import User
from .forms import RegisterForm
from vanilla import CreateView

class RegisterView(CreateView):
    form_class = RegisterForm
    template_name = 'v3/register.html'

    def form_valid(self, form):
        user = form.save(self.request)
        return HttpResponseRedirect("http://akvo.org")