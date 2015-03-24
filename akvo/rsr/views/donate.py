# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import urllib
from urlparse import urljoin

from akvo.rsr.decorators import fetch_project
from akvo.rsr.forms import InvoiceForm
from akvo.rsr.models import Invoice

from .project import can_accept_donations

from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.utils.translation import get_language

from mollie.ideal.utils import query_mollie, get_mollie_fee
from paypal.standard.forms import PayPalPaymentsForm


def render_to(template):
    """
    Decorator for Django views that sends returned dict to render_to_response
    function with given template and RequestContext as context instance.
    If view doesn't return dict then decorator simply returns output.
    Additionally view can return two-tuple, which must contain dict as first
    element and string with template name as second. This string will
    override template name, given as parameter
    From: http://www.djangosnippets.org/snippets/821/
    Parameters:
     - template: template name to use
    """
    def renderer(func):
        def wrapper(request, *args, **kw):
            output = func(request, *args, **kw)
            if isinstance(output, (list, tuple)):
                # add current language for template caching purposes
                output[0].update({'lang': get_language()})
                return render_to_response(output[1], output[0], RequestContext(request))
            elif isinstance(output, dict):
                # add current language for template caching purposes
                output.update({'lang': get_language()})
                return render_to_response(template, output, RequestContext(request))
            return output
        return wrapper
    return renderer


@fetch_project
@render_to("donate/donate_step1.html")
def setup_donation(request, p):
    if not can_accept_donations(p):
        return redirect("project-main", project_id=p.id)
    request.session["original_http_referer"] = request.META.get("HTTP_REFERER", None)
    request.session["donation_return_url"] = request.GET.get("return_url", "")
    return dict(project=p)


@fetch_project
def donate(request, p, engine):
    if not can_accept_donations(p):
        return redirect("project-main", project_id=p.id)
    is_test_donation = getattr(settings, "DONATION_TEST", False)
    if request.method == "POST":
        donate_form = InvoiceForm(data=request.POST, project=p, engine=engine)
        if donate_form.is_valid():
            description = u"Akvo-%d-%s" % (p.id, p.title)
            cd = donate_form.cleaned_data
            invoice = donate_form.save(commit=False)
            invoice.project = p
            invoice.engine = engine
            invoice.name = cd["name"]
            invoice.email = cd["email"]
            invoice.campaign_code = cd["campaign_code"]
            invoice.is_anonymous = not cd["is_public"]
            original_http_referer = request.session.get("original_http_referer", None)
            if original_http_referer:
                invoice.http_referer = original_http_referer
                del request.session["original_http_referer"]
            else:
                invoice.http_referer = request.META.get("HTTP_REFERER", None)
            if is_test_donation:
                invoice.test = True
            if request.session.get("donation_return_url", False):
                return_url = urljoin(request.session["donation_return_url"], reverse("donate_thanks"))
            else:
                return_url = urljoin(request.domain_url, reverse("donate_thanks"))
            if engine == "ideal":
                invoice.bank = cd["bank"]
                mollie_dict = dict(
                    amount=invoice.amount * 100,
                    bank_id=invoice.bank,
                    partnerid=invoice.gateway,
                    description=description,
                    reporturl=urljoin(request.domain_url, reverse("mollie_report")),
                    returnurl=return_url)
                try:
                    mollie_response = query_mollie(mollie_dict, "fetch")
                    invoice.transaction_id = mollie_response["transaction_id"]
                    order_url = mollie_response["order_url"]
                    invoice.save()
                except:
                    return redirect("donate_500")
                return render_to_response("donate/donate_step3.html",
                                          dict(invoice=invoice,
                                               project=p,
                                               payment_engine=engine,
                                               mollie_order_url=order_url),
                                          context_instance=RequestContext(request))
            elif engine == "paypal":
                invoice.save()
                pp_dict = dict(
                    cmd="_donations",
                    currency_code=invoice.currency,
                    business=invoice.gateway,
                    amount=invoice.amount,
                    item_name=description,
                    invoice=int(invoice.id),
                    lc=invoice.locale,
                    notify_url=urljoin(request.domain_url, reverse("paypal_ipn")),
                    return_url=return_url,
                    cancel_url=request.domain_url)
                pp_form = PayPalPaymentsForm(initial=pp_dict)
                if is_test_donation:
                    pp_button = pp_form.sandbox()
                else:
                    pp_button = pp_form.render()
                return render_to_response("donate/donate_step3.html",
                                          dict(invoice=invoice,
                                               payment_engine=engine,
                                               pp_form=pp_form,
                                               pp_button=pp_button,
                                               project=p),
                                          context_instance=RequestContext(request))
    else:
        invoice_id = request.GET.get("invoice_id", None)
        if not invoice_id:
            donate_form = InvoiceForm(project=p,
                                      engine=engine,
                                      initial=dict(is_public=True))
        else:
            invoice = get_object_or_404(Invoice, pk=invoice_id)
            donate_form = InvoiceForm(project=p,
                                      engine=engine,
                                      initial=dict(amount=invoice.amount,
                                                   name=invoice.name,
                                                   email=invoice.email,
                                                   email2=invoice.email,
                                                   campaign_code=invoice.campaign_code,
                                                   is_public=not invoice.is_anonymous))
        if request.session.get("donation_return_url", False):
            request.session["cancel_url"] = urljoin(request.session["donation_return_url"],
                                                    reverse("project-main", kwargs={'project_id': p.id}))
        else:
            request.session["cancel_url"] = reverse("project-main", kwargs={'project_id': p.id})
    return render_to_response("donate/donate_step2.html",
                              dict(donate_form=donate_form,
                                   payment_engine=engine,
                                   project=p),
                              context_instance=RequestContext(request))


def void_invoice(request, invoice_id, action=None):
    invoice = get_object_or_404(Invoice, pk=invoice_id)
    if invoice.status == 1:
        invoice.status = 2
        invoice.save()
        if action == "back":
            return redirect("%s?%s" % (reverse("complete_donation",
                                               kwargs={'project_id': invoice.project.id,
                                                       'engine': invoice.engine}),
                                       urllib.urlencode(dict(invoice_id=invoice.id))))
    return redirect("project-directory")


def mollie_report(request, mollie_response=None):
    transaction_id = request.GET.get("transaction_id", None)
    if transaction_id:
        invoice = Invoice.objects.get(transaction_id=transaction_id)
        request_dict = dict(partnerid=invoice.gateway, transaction_id=transaction_id)
        try:
            mollie_response = query_mollie(request_dict, "check")
        except:
            pass
        if mollie_response is not None and mollie_response["paid"] == "true":
            mollie_fee = get_mollie_fee()
            invoice.amount_received = invoice.amount - mollie_fee
            invoice.status = 3
        else:
            invoice.status = 2
        invoice.save()
    return HttpResponse("OK")


def donate_thanks(request,
                  invoice=None,
                  template="donate/donate_thanks.html"):
    paypal_invoice_id = request.GET.get("invoice", None)
    mollie_transaction_id = request.GET.get("transaction_id", None)
    if paypal_invoice_id is not None:
        invoice = Invoice.objects.get(pk=int(paypal_invoice_id))
    elif mollie_transaction_id is not None:
        invoice = Invoice.objects.get(transaction_id=str(mollie_transaction_id))
    if invoice is not None:
        return render_to_response(template,
                                  dict(invoice=invoice,
                                       project=invoice.project),
                                  context_instance=RequestContext(request))
    return redirect("index")
