from os.path import abspath, dirname, join

HERE = dirname(abspath(__file__))

PROJECT_UPDATE_XML = """
<?xml version="1.0" encoding="utf-8"?>
<update>
  <locations>
    <list-item>
      <id>4</id>
      <latitude>-23.0595163</latitude>
      <longitude>14.8535156</longitude>
    </list-item>
  </locations>
  <text>Bar</text>
  <update_method>M</update_method>
  <user>1</user>
  <photo_credit>Da credz</photo_credit>
  <language>en</language>
  <photo_caption>Da caption</photo_caption>
  <title>Foo</title>
  <project>4</project>
  <user_agent>Akvo RSR Up v1.5.0 on Android 4.4.2 device HUAWEI HUAWEI Y541-U02</user_agent>
  <photo>/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gNjUK/9sAQwALCAgKCAcLCgkKDQwLDREcEhEPDxEiGRoUHCkkKyooJCcnLTJANy0wPTAnJzhMOT1DRUhJSCs2T1VORlRAR0hF/9sAQwEMDQ0RDxEhEhIhRS4nLkVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVF/8AAEQgAqQEsAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A4SxbNygU8g+uK9G01QY1k74rz7S4VWcb1JGa7+wvIYkVS2xW/vc/rXL1OqWxb1KRIrORz1VScVxAut8onZQxHPNdnezW9xbMm8HI/OuEmCRSsnmqoFWkKMlbUn+2tLuDN1PNVLq4aGeK6h5KDaR/eHpTkFguc73OOSDgUNAjqGSQGMEHBqrEuZ1VlplreJFf3EZ3KudrH+dVtauPMZfm4649Ktm5VdPiSNsAgEn0rG1MsFUnqOcUJEt3K6ZZyAQVYYI9+1aNrvhhaQZDkrke/Bx+lYKSlZMg8E8YPQ10NrKssbfdIkX5Sf4WHY0ySTVbf7SyXMbYjztk56HNVvMit02g8jjA6mtSC3E8kqj5UuY+5+646/yrGZUs8hstKDg1x1YWZ10p3VgKmTMty21B0X0/+vUElwW/dwqVTse9MlmMhy56H8B9KheYFcDis1E2uOdgh2hvwFOSNpMEnav6mmRw5w74x6etTeco+tD8holXZGvy/mahe5APy/nUcju/sKrHr16UlHuO5K0xbrSxwtLyflX1NMjAY54xU7dMMfzqnoIkzHGMRjJ7sarzSge59KbJJjhe1VZJcZ5ojG4mwmk9azZ5+eKdPPnpVGRsmuuETnnIdH87/MfzroIpbW40uWJgquoyh965tiVUYpBK2MZrW1znvqbdohkljwQSvGc11hHm2Skc4rj9OuDbqz8HA71f/ty6jLG1jR0YZ2EdDWck2aQlySuddasWjAPQdKmUv9qKDJ3YH0Fcbba9eFkM0eFB9MV1en6l9oXeVArNpo6PbOTbsS62AqrIFyTxmsAqzHJ4HvWjfaiGDZ5ANY8s0kxwCVFc017xrFWQ6WZYRhRlqq7pJn+YnFTCADknNI8qIPU+gpK3QbARqp3YGemajeU4wo/wpuZJSOw/Sp1hxyTn1qttybkAQk5Y8+9BGDxTpGUHAG5jTxb7hk7R7YptgUdMkRZ0ScFgeODWhqkb+SFiJ2DkEHisuzjJkUgZb64NbMiyLAWJBX34I/KuuO5xTObFxdNuLSSYA67s1BukMgZyc1q3itDhmG0E7ulZBm+fHX+lbGJoxAAEn7uM1ZJ/d7QcAmqcTh1G38qu2xR2VHOMnoaQze0U+ZCo5Krxk98f/r/Sk1LDg54NaFlbiGEFeB0x+RrL1RvlJFSMyI4mMoUjKucDPr6VrWcUqqDGpYEdP73/ANeq8Nu13pymMMZUkJ+Ucn/6/X61rafcxzW8gOFdcMy9vqPY/oaALccm2x+0xt8gO8ex6Ef596rapbq4W8jHyzKNw96kjOI7qL/lnIN4wPUEE/yp+nSLMslpL9xh8pPYjoamUboqLsznHbrgHPFIkQzluvp6Vel0+SG4mjwf9n88VA9u+eFPAxxXO4M6FUREzlulMJVRkmmyK4GCCMVEVK4z170uQtTQ+R85ycCowC5woJNPjiMzZJ2qO9Wgyou2Ecd2NJ6FXuRJEIBucgGo5JsngYFJJIAeCS3rVSSTaM5pqNxN2FklxzmqU02abLMScZqszgE+tbxhYxlIU+/eoW5OBStJzSxctn0rVGTYjjcuKhAwaleQFm659Kb/ABYNUjNliHzZFKgfL7Vr2aG3RJuMg/dNZttLtdVPTvVt76NG2A5A6/WoZpG3U1bh0uwwRBH346ZrX0OF5IjG/X1FczHch+ei4rc0vVVS3IQHd0rOSNbpbFjVESKRbeDlU5J9TVHAXqRRJK8sh4JyaetvjDSMOexrjk9Tqi9CFizjA6ep4qNY1zgfN79hTrhizEL9z2pYAB0G5u57Cn0C5OiADKj/AIEaZLMFGB+dNkl3HYo3MevpQluu7c/zH9KXqIIwMZH/AH12p3y9wCfUmnu2B12iqhkOeDx9KLXEZNos5lUopx644rqY0MltllUt2P8A+qubtEVpgHOF7mt+NHZQqGQqOFLLj+tdqepyTRkakhdMMuxuQVzw3oR/hVTRIFE5ZwCR610M9o7psmU4/wB3B/Os5bCS2lZR8rEcZ/nV9DJaMbqenqD9otuHHLKO9FshERdwN4OOamtlYTgzMSCCParYjG5VGCxbHTrQge+hvC5WSyRogNuxenYgYIrm9WugnHqa6a5hTStGcHlw+4/jXNTxx3IDuuY3I59Pf9f0oQBoszFZoUJEgxIp9ecGt62sFkZJNm2VoyXAGR/F/UVW0XS1gkDyEFo90Z46g8g/p+tdFHAizRyodqZIIz0zx/WhsBgsFW32joQNvt1p0GkrGVYYKr+fA/8A11Z/5dWRDgq3A9KI7wMiKOvX68D/ABpDFltIt3nFRkLzWfFDF84Cjfn5fer89x/o/A65B/Ks6xO+Zu4HIx29qAElsIc/vIgT9OtVLvSLaZf9WUPtXULFuVS31Gf8+1Vbi3Cs+elKw7nHXGkNbr+7yye9ZsqsMjBGBziu9mtQuDjGR0rKvtGW5jJjGD3A71DgWptHDyliMK3+FU5XJ6ngd63r3S5YVbK4APLegrnbslSVAwo/OqigcytJKCcDj39ai5PTpTiuzlxlv7v+NM8uWUgKpPYACtUjNyGsRnAOferMCArmmrp8w/1ilB6HrVyBFUYA4HWhtCRQcYkJHWlIIAJBx61amg2yZHSiG5EStG0YcHoCKLiC2gE65I49RVyG0hiwzLn602xTyoOeC38qmdmJyRjjikwB2jyEWMZx1ras7NYrYM4wTWNYBWvEDc5NddKPItwcdu1Y1djWl8RQARASSFHoapSSh5MBixPGAKWR2lfDZwT0qxGsdsm5gqe56muPY7dyAxhBvn69kFNMjy/uox9cdqC4nl5Yhf1q0oCLtjUKo79zTvYCOOERjDHn0FSFSOnX1PagcHnjPbuaVsE+tSIgkT5TuPXuag2Rg4PX6VLOcH1b+VVWKsckZP1rRIClaAvMMZOPfFdbaiCeLmYYGNwHyj/GuNg3GVVUnJPGK6ewhSDKtw3HHfNdS3OWZcuUhRDGJ2JPG3Of0pgtWkwJRnHANWI3ihChYlLPyuBn8asMQU/vOBzirMjFnswuV981fs7FfNtpWzuMgb06VRla4kcb12qTwfWr8CTMY1Q/vF6NnigRL4imM1o6JypIB9RzVXSLLfbRmZcbecH0/wAgVtpZxg75AC5HK/zpSixBSCAB2xRcdiGCMwlVHKqBj1wBipZZwEiYAYY5OO3+R/Kpv3bqMMOOmKzZpCpaJvuk5U+h9KQFtrkAIFcB8EfX0pqS4MbL905BHoc1mKjOcbgecj3rW0+P7VBIGPTjnqp96AK9zd+WCjtxk9O/B/8ArVJp6mLZIvO5gp9jWLqtx5LMP4lPIresF36EZj1YeYD70wOkO3y06AmopFSRijH5if61ly6ksltG+fuhnwPQDj+lVNL1VrrUCHJCKc5/l/n3psDZvwqRj+8RxRDCskaHblge1QXTtd3iRx/dUdauwEICAeR60gKOpaZHcQuNo45Ncjd+HbSOQySbuT0FekLCGQ55J7Vm3tigViy5wOeMjNMDiI9I0yNVAgUsR35NJ5UeWS1t1H+1gYFXprVhcOXyS3YelSbESPbgjtgD+tIDl9Tto7YHc/mSnso4H41jIGL7lOQeorZ16dIzsDLvJ5A5x9azIIyMkDkUbAPaEFeQc9sVCtqMg7up44rSgAkO1x071YOnMimQjA7YOaExWM6OILxgj60MjStiNc+9XGgXccE4xjNSqhRAkeCaTY0l1Ktlp4S5h+YmQv07Yrpr+2MigDaigc5PNQaDpTNd/aZXztH4Cr+oqC5O/IHYHisarsjenbm0MfEcKny1yfWqU5Vyd/X8zV2Xc/3eg6k8VVkUDkkE+w6VyxOorR/e3Hp71fVhgE59qppHufrwOpIq9HHjGOnrVSEIvGemPTvUcs6KMKcmp2VOh79vWq72yuT8oHtSVgKjODnnr60qxx7eSc1J9lYZwQAKBbsB0z75q7kmJG+0ghsfTrXQacxlCKzMsa8sQetc0nL9gfeuj0uH9yoYsMnnJ/zxXXaxzS1OhECyxoc7Q3OB+gqcRJGuc4Udh3pUlSCxUoC0jDjPp6+1VjI05D5+THyj+8aoyK9yzzSlEIC+hHX6Vp2FuYYgzNuI745NUZ4G+Tg59R2rRhbCDJAwPWkwHSygZaTg9qybzUWVuB+dSX90Zcp2HeqMFs8xztYr1AP9KQxFe5d9wYgHuD0qWV7pHDFfMA9OadPZ3FpH5i5aH27VWillbcY5NrDpzTEaQubbytryxxl+Ssp2j8D/APrrW0hYzNiOXerjqGzisix1WUMIbqASoeDuAIq6/g61vh9s0OdrC8GG2IfkP4dqpIRk+JdNnTU1VEJM2B7E10sKrZ6M8En8KgceuP8AGsm28SPbXIsPEUQjuYzgTEda1NVZJrB5o2ymMgg4/wA80AY7ybhJEuOTjdnGB3z+FQ2IaGUKD9+TGPUcY/z7VUik3pkKd5znH4CtfRrU3OqW5K9sEZ/OgDqLGzK4lfBVUwPc9zVeO5Dz7kAOThR6Ct+5t/JsH2L0XAAHtXN6PYyiF5XRtxzgEUNAaNvchZPnOfar8qiWMgLkt69BWQlo3m5d8H2rWjwqbc5P1oQM5bUw0bOsURdh6cfia5u/F46lS/lJ32fL/wCPHmvQbu3CxOyjHGTxzXkXiSa7lvWVgFiHQDr+NFguVNTNrAQI3Ekh64OQPxqzbxgoskfII5HpWAYwvU10+iL5sagjKt3x0oewDokQzEk4b0NaE7ssaKoJRRyc9ao6rpc0R3RZPcEU/Tp2AEcqsc+tRYZBJ5jONidavWOnyyuBIcDOavCOMOGUCrsdvLI6mPhaLhY04bIQWeEA4H51z9026Q/KRjseldXbhkiKvzxXO6rHEsrMQwz0GKxrK6ubUnqYkzYPTk/pUKDJxxjuxqVl81ieVUetQbDvJ7D16Vzqx1FnEaAbQPqTxR5wPAbJPpVZ1LDO4kepNOR0jHJwPQdTSsO5OCcn19utBIxknI9O1RiX5cnCDsOppjSf3fzPNFiSUkcd/TPAH4U1nXPLt+ApmGJwQRkdWppifPyjIp2AwYEzKPl3exroLKBt6jdgf3fSseNNnTj3rd0gx7gBIS/fcK627mEo2RpuWlcx5KgqEHsvf8ScVpLbhDhW2sFG32FVreNDJ5hywQnjHU0ryvDjGN7nLE81ojnK80TxTjDq2euVbJ/SpRdgKI2R/wARVpJGJG6JCGHYcVKCqDhF/wB1un4Gkxoz5YI5oiwYofrVZbg2SKhDGPPB9PxrUmAlUqiMueo5IrO+yOGH7wKM9DkD+XFSMuQ6gjQkH5k7+1QrbW056+Ueu7HH41bgslQDKo4PJB4P4Gr9vBENoTBUdA3Vfb6U0xMp2mkSRzKC2QG/h5P+f8+9dPY2Elq4eE5B6jGKgsrdFfO3aVHy+hH/ANatKa48uBipw2Oea1jYlnOeP9Ptp9FkuJoQ0qjh+4NcXo2sN/YEtrL8xhOAT6dq3/FV9cXdj5ABIbgn1ri0xbu0A+7tw3+0aHqB0enTRtEQRw3RvQ11Wim2SZWTDOeSe/8AniuG0+6AAC9K6fT3QIZB8pXmpvqOx0+ueKU025jtI7d7idxkIo7VUW48RXyFooLSyX/ppl2/TFZ+hWj6jr9xdzsHdR8g9q6O5F0XK7WjQCr1ZJmsl1CuZ7q3eXGTtUgfzqm1/d253Eo/rtpl3bHfucMCfrUMdq0h/d5PrUMo2LfUVvIsNnkYINcb4m0aUuzW6lw/cDp7V0kdlNaShm+4RyKszIs8TKwypFFwPIpdFmL7cZY9hzV/QTJbSPE4IKnBBrv4oLezikdY1XAyTivNYr6RtVuLjn5pDwaN0I6/zFm4XhvT1pqWsTyZA2kntWV9s23MRXjf+la1t+8bDH5s54qCi2LRM5U5HYVpWaiNcVVVT1/KrEMm0jPSgC+HABx1rntYlJbABye1dFGI5BxjNc7rCFJyMEVFX4TSl8RiyR5XDEZPYVA0YOADwKtmLavfn9aZhVPzkAelcdzqKcqHI64oMJ2jYoHuasSTxL90fjULykjK4H1qlcBqwDOXqQCOEZ4B7Z5JqBRISWZj9TTCqg5Zjz+tOwiR5SW+UZb3qMhmOTLz7ZprSAL8i4FR+ZJ2OPpVJDTRSZgpwOTW1o7iNt+3nov1rAB5yc1uaUzTOqjOAMfWt9jKWx0divk243/M0r7iPbt/T86mazaScljyRjnv61LDGGKbSTt9K0o7RmYMBnjGa0RzMypYWiGA2cdRt6UkUSynAIY+jcVvx6YoXceWPJrMv9N3uTH8jClJAmVDYMrHZEwz1KtxUqxoi4dm/wC+v/rU63lntARIRJ77qka8tpTh1Ib2FQUhI9oI5JH+7mrJ8lsFHUMOm4YP51SZxGcoCR24py3SOuGVwfxFSpDsasInZc/KF/vLz/KpLmJpUEYcMMcsDgg+1VLa5UrtEhOP4XH9astMrnEu/OOdpJ4rWLJaOfvo7iGTy2jZWboQMgj61w3ilJLHUFQD5WUEt6mvXTEHRkjcHJBw3TFYXiXw1/atjl0AlQHBHf8AGrTsTuebaXdtG6ljlTXUjUvKjHk5bPB4rjLixl028dZEKY6ehq3bC5vDGkJkJzgBR1NNpBdo9W8IyeYxuQ2BwOO1d8VEiAnuO1cX4H8PTWWhL9odo5pH3sp7e1dpGNq7c5xVxIZjX1iCx2qOe5FQWcBiOJEHHeugkUHvisy9jwpKn9aTXUaZWvI0eLoCRVHbhcYq9GHdSD+hqN4ynBx+NQxmBqqlLaTGQCD0rgLLTt00jbfl3Eg5zXp97AssLKc8isN9PWOBggpDORltXEqsOMHArVs5AJCrLyOM1ZW03OGIyR0+tKlqd7epqGNFxHHapQc1TRChwKnRjn5uaLjL1uXyMGqmsyqV5wWHQ1dtdrcCs3XFaIEnBXuPWlP4Rw3Obld95JlPsAKiVTgk8n1JoeQE8DI9CajJeUcDAFctjrH4Qcs3PpTDOqjCjn0FN8kjqePWo2lji4Tk+tNIB7q74Jf86ifanfcaryXeM5IUfXmqj3PcZrWMGQ5F15wvQ8/rUBmOemfrVJ7jA/xqAzEn/GtFTIdRF9FA5xmtfR5WEhCjHbd6VkZweKu2bu7qoAIBqS5bHoOlbTH8gz2BrpbSHMAU9eprkdImJkKhgRGABjoK7CxcZPuK1icsi0YQ0QPf0rPubfchHIPr2rX24Ue1V5lwQO5rRok5l7eRCcjIqlMuM+tbUsgG4ggd84xWTcyqSdxUmueaNIlBnVWxz9CaCcjKgZ9qZLtYk5B+lLE3Yn86wNii2p3Vnc4kQeX65xW1Y6itygMcx+g/+vVKa0WUHvVVbFopN0Z247jitYslo6dLnaMEqSRyTxUdxd7YgpfaFz/FxisZNPkuZVWW5m2H+EHFXU0eDOxWLuv3hu6CtUSrXOU8SSQ3M1vGilo/M+eTsPbNdj4csbaJoZFjT5RwMVFHo0MiOhVWz7VattMuNNVXtMyRf88z1A9qC5ctju4ZQYgQgUVKrjGT+lZdizvEhZTk9sVpqpA5GK2RysR2XPpVO6+ZDg4NWZUbHAFVZFfpj8qGCKKSsjYJzUrENyRipBH6imSBfuqakZQucuNoGR6ioWtk2c4GB0PergQeZgHn0rN1MSiT5SQo7jvUjKFzEEZsHGe/pVaDAPH3R3NF1LhCqklu5qG1ilZvnJC+nrUDLyRKw4FOMY9KkQBR93FOwCKYCRx4INUNaXzYCvOD19q1Yxk1l63mJT2z0OKdroE7HHvsifbz179TUEl6qZ7DoCasXqFcyE9TwPSufkLu7A9M8VmqXc19oXZbpmbjJ981XdnY+g7VKIS9upUfxAGp3tWRSSPurxWqikZuo2Y0hPqalij3fUHHPqatzW2GJxyDx71Lb25C8jndVkczZly2x9+KiWAAc9a2biFgh4+YnAFMMHlAIAMgc5GeaLgVtuDVm3dlICnB9TUIH41JGDkHpXNc7bHX6XMkUAiiJ3scZHUn1rtNKnGxGP8ADmvPNKcRRb2G5s8Z6ZrrrCbEDqCeo/H1qos55rU7HfwnPbJqG7lCuB6Liqv2sfY/M646e9VpZTIy9SWBzWzZlYr3EQkiwTt6c+9Ykkccbsrvlie/FdGyFwSO3auU1VGW9LBGyeB7VlItCSWvdRUXlOh5FWY7gqypIBn2qyJYmbYvL1i0aqRHASVAIqysKP1Uk0+K3zVlU2kKvWkk0DY2OBI4gFHznpV/TtP2h5JQMt3qKCMB8v1rYjAMW0dO9bwRk2Jb6dGVLKoBNaENsu0AqMCo4XSJQM1OsqgcGtlYhtssKiKOBinZFVvMJ6GlGc1VySViKgdRnNSFgBzVWefjGKTBEU8wB2DrUKxsw571Iq7zk0/Iizn8KkopSLtfIB4qG5ZGU5H4VdlYY6DFZ8xA+6vHqe1JgUJYoweUBJqukQLNg1aZ08wgc4pjFIzwOTUDK5UqeOacM59KRCVB3DrT0wwoAngXJzmql8d5ZH5HvVmNtuTnpWdcTCSRhnmqAxbuzBO0ISOpzWRNpyRrggZaus+zmZSei/zqtNZZyQMtjrRcDnbe02IQR0OaufZhLYyADkDrVh4GhAV+SasWUO1WU/xUXAyZ9PVVIHVfmz61AkHlzAHkHBJroUtt0bsw6DHSmf2aFiLkZYnNO4WMf7KskYYL85OcfyqvNppaQlutdHFZjzAQDjFWG0+NzlwMn1oCx55jj0pUYBv61XLs56celKsTN1rCx2XNq2vNpQjopzXS6Vc7Y1LFmZ+2elcTE3lnk5x610WmznKAk5xuP9BQRNHa20/mqYm4IA4/Cr8ce1ix/CsGKQeYkiH7iktz3robWZZlOOoFaR1OdoXaNxHtzWTeQCR8ba2kTOXHQ1SuIzyUxntTYkc29ttmY7ec4FFpDulZurIcZrYaAYJK8gcmq0UPkRlu7HNZtFXLVuMDnjAqZVywIPQ9ajtJ97lHQ5Hcd60FWMjHNPlFcrwqxfnpWxCi7eKrxQLhcEcVbA2jirirCbEljBpIQ6tgcipEfcvINSxBV4zViFBYc04Fz0p+3dTxgDB4NUIiIOKhZSTz0qZpAQfaoWlVgSp6UgBEA5qC7nUZBGcDpSiQsjHsK5vU7z/TIo3LYZ8bhSbsho0Xl3JvHA7DuahM/GX6e9LGAfmz8qDGKikUyjc/A7CpGVLq8SA5PQ9MDrVdrtmGeQPQiprmAy4IGMdKrSOYuDnNICTzlYEsaZHJ5ZwGJU+tNAZwN0YHuaDEO+cCgCUTtzt+ambI1+ZvvGpAhwNo/Gm+QA2SCW9aYCl2xgLx6U1S7PjacVYSHoSeKnRFBwBQBSlsRMASvTnJqF7Uo4YAgCtqRSsZNUQHlU71IHagCuoGCuPSpXQeUeORSw2zbyx4GeBVpYxvbjjNMCFbfbGABgkdagktxvOc1fkmRCVJHAqDLy/MFwD0zQB5MSkfU00ys/3RgVG/+sNSx/0rGx2J3FRCDuJya29PuVgBdjhsYFYy/eqyvQVLG0dNb3e1lCE4JAOfrXR6dd/vWZTgZBx7Vxtt0T8a6Kz+4fof5iqiznkjrIpgS2D0PFQtIJFLr0zVbTvuS/U/0pYf+POP8a0uZD3XzO2EAyaq7fOcHGVHQVaX/Un/AHagtKTGWba0DyEkbfSrTQ+XEVfgr0PrTk6L9aTUv9Qn0qlsImhjDKGBPNWCrMFHTHU+tQ2X/HnHVpvumqQgQcAYNTeWD2qMdU+lTL0NUIApHK04sTwRyKF60poEV542KfJgH3qIxiOLn5j3q033ajl/1ZoAoNgqVB4rn76y+1XSBc/Kc4Het7u/0qjb/wDHw30qGUjLile1vRGSGD9UJq1NLK0u0Rn8Ko3P/IeP+6K2h/qxUjKYhkcEueB2FQeTGshydzfyrRj/ANRJ9DWY/wDx8v8AX/CgCbyxwT1/lTxChXFD/wAP0p6fdH0pgQlduBg1KsYZeadJ92pE+5QBVdN3ByAKmhQ4+lD/AHqfB/FQAqqWbd1HcU19gmCDk9/apIOjfWq//L431FMCUR+WwLHg1Wubgu4ith9WI6Vdn/1RqnB/H9aBDFsgp8yVtxNSGQDAUcVM/wB01VNAH//Z</photo>
</update>
"""

ORGANISATION_XML = """
<?xml version="1.0" encoding="utf-8"?>
<root><total_budgets></total_budgets><recipient_org_budgets></recipient_org_budgets><region_budgets></region_budgets><country_budgets></country_budgets><total_expenditures></total_expenditures><documents></documents><name>ABC</name><long_name>ABC.XYZ</long_name><language>en</language><organisation_type>N</organisation_type><currency>EUR</currency><new_organisation_type>22</new_organisation_type><iati_org_id></iati_org_id><url>http://www.google.com/</url><primary_location>3</primary_location><can_create_projects>True</can_create_projects><content_owner></content_owner><allow_edit>True</allow_edit><public_iati_file>True</public_iati_file><can_become_reporting>False</can_become_reporting><internal_org_ids></internal_org_ids><absolute_url>/en-us/organisation/4/</absolute_url></root>
"""

GET_URLS = [
    # akvo/rsr/static/scripts-src/my-projects.js
    '/rest/v1/project/?format=json',

    # akvo/scripts/cordaid/organisation_upload.py
    '/api/v1/user/?format=json&api_key={api_key}&username={username}&user__username={username}&do_format=1',
    # XXX: /rest/v1/internal_organisation_id/?recording_org={recording_org}&identifier={identifier}&format=json,

    # akvo/rest/filters.py doc examples
    "/rest/v1/project/?filter={'title__icontains':'water','currency':'EUR'}&format=json",
    "/rest/v1/project/?filter={'title__icontains':'fiber'}&exclude={'currency':'EUR'}&format=json",
    "/rest/v1/project/?filter={'partners__in':[2,3]}&prefetch_related=['partners']&format=json",

    # akvo/rsr/static/scripts-src/project-directory-typeahead.jsx
    '/rest/v1/typeaheads/organisations?format=json',

    # akvo/rsr/static/scripts-src/my-details-employments.jsx
    '/rest/v1/typeaheads/countries?format=json',

    # akvo/rsr/static/scripts-src/project-main/project-main-report.jsx
    '/rest/v1/project/4/?format=json',
    '/rest/v1/project_location/?format=json&location_target=4',
    '/rest/v1/indicator/?format=json&result__project=4',
    '/rest/v1/indicator_reference/?format=json&indicator__result__project=4',
    '/rest/v1/indicator_period/?format=json&indicator__result__project=4',
    '/rest/v1/indicator_period_actual_dimension/?format=json&period__indicator__result__project=4',
    '/rest/v1/indicator_period_target_dimension/?format=json&period__indicator__result__project=4',
    '/rest/v1/indicator_period_actual_location/?format=json&period__indicator__result__project=4',
    '/rest/v1/indicator_period_target_location/?format=json&period__indicator__result__project=4',
    '/rest/v1/transaction_sector/?format=json&transaction__project=4',
    '/rest/v1/administrative_location/?format=json&location__location_target=4',
    '/rest/v1/project_document_category/?format=json&document__project=4',
    '/rest/v1/crs_add_other_flag/?format=json&crs__project=4',
    '/rest/v1/fss_forecast/?format=json&fss__project=4',

    # akvo/rsr/static/scripts-src/project-directory.js
    '/rest/v1/typeaheads/projects?format=json',

    # akvo/rsr/static/scripts-src/update-directory.js
    '/rest/v1/typeaheads/project_updates?format=json',

    # akvo/rsr/static/scripts-src/my-reports.js
    '/rest/v1/report_formats/?format=json',
    '/rest/v1/reports/?format=json',
    '/rest/v1/typeaheads/user_organisations?format=json',
    '/rest/v1/typeaheads/user_projects?format=json',

    # akvo/rsr/static/scripts-src/my-results.js
    '/rest/v1/partnership/?format=json&project=4',
    '/rest/v1/user/3/?format=json',
    '/rest/v1/result/?format=json&project=4',
    '/rest/v1/indicator_period_data_framework/?format=json&period__indicator__result__project=4',
    '/rest/v1/indicator_period_framework/1/?format=json',

    # akvo/rsr/static/scripts-src/my-results-select.jsx
    '/rest/v1/typeaheads/impact_projects?format=json',

    # akvo/rsr/static/scripts-src/my-iati.js
    '/rest/v1/project_iati_export/?format=json&limit=50&reporting_org=1',
    '/rest/v1/iati_export/?format=json&reporting_organisation=2&ordering=-id&limit=1',
    '/rest/v1/iati_export/?format=json&reporting_organisation=3',

    # akvo/rsr/static/scripts-src/project-main/project-main-partners.js
    '/rest/v1/partnership_more_link/?format=json&project=4',

    # RSR UP urls ################
    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/project_update/?format=xml&project=3&last_modified_at__gt=2014-01-01',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/VerifyProjectUpdateService.java
    '/rest/v1/project_update/?format=xml&uuid=%s&limit=2',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/project_up/3/?format=xml&image_thumb_name=up&image_thumb_up_width=100',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/country/?format=json&limit=50',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/user/3/?format=json&depth=1',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetOrgDataService.java
    '/rest/v1/organisation/?format=json&limit=10',
    '/rest/v1/employment/?format=json&user=3',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/organisation/3/?format=json',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/results_framework/?format=json&project=4',

]

POST_URLS = [
    # akvo/rsr/static/scripts-src/project-editor.jsx
    ('/rest/v1/project/4/project_editor/?format=json',
     {'rsr_project.title.4': 'foo bar', 'content_type': None},
     ('Project.objects.get(id=4).title',),),

    ('/rest/v1/project/4/upload_file/?format=json',
     {'file': open(join(dirname(HERE), 'iati_export', 'test_image.jpg')),
      'field_id': 'rsr_project.current_image.4',
      'content_type': None},
     ('Project.objects.get(id=4).current_image.path',),),

    ('/rest/v1/project/4/reorder_items/?format=json',
     {'item_type': 'result', 'item_id': 2, 'item_direction': 'up', 'content_type': None},
     ('Result.objects.count()',),),

    ('/rest/v1/project/4/reorder_items/?format=json&dedup_param=indicator',
     {'item_type': 'indicator', 'item_id': 1, 'item_direction': 'down', 'content_type': None},
     ('Indicator.objects.count()',),),

    ('/rest/v1/project/4/default_periods/?format=json',
     {'indicator_id': '1', 'copy': 'true', 'set_default': 'true', 'content_type': None},
     ('Indicator.objects.count()',
      'IndicatorPeriod.objects.count()'),),

    ('/rest/v1/project/4/import_results/?format=json',
     {}, (),),

    ('/rest/v1/organisation/2/add_logo/?format=json',
     {'logo': open(join(dirname(HERE), 'iati_export', 'test_image.jpg')),
      'content_type': None},
     ('Organisation.objects.get(id=2).logo.path',),),

    ('/rest/v1/organisation_location/?format=json',
     {"latitude": 6.275766,
      "longitude": 7.006839,
      "city": "Ukpo",
      "location_target": 1,
      "iati_country": "NG",
      "country": 2,
      "postcode": "101010"},
     ('OrganisationLocation.objects.count()',
      'OrganisationLocation.objects.get(postcode="101010").latitude',
      'OrganisationLocation.objects.get(postcode="101010").longitude'),),

    ('/rest/v1/organisation/?format=json',
     {u'allow_edit': True,
      u'can_become_reporting': False,
      u'can_create_projects': True,
      u'content_owner': None,
      u'currency': u'EUR',
      u'language': u'en',
      u'long_name': u'ABC XYZ',
      u'name': u'XYZ',
      u'new_organisation_type': 70,
      u'organisation_type': u'C',
      u'primary_location': 2,
      u'public_iati_file': True,
      u'url': u'http://gooddeeds.example.com/'},
     ('Organisation.objects.count()',
      'list(Organisation.objects.order_by("id").values_list("name", flat=True))',),),

    ('/rest/v1/organisation/?format=json&dedup=content_owner',
     {u'allow_edit': True,
      u'can_become_reporting': False,
      u'can_create_projects': True,
      u'content_owner': 1,
      u'currency': u'EUR',
      u'language': u'en',
      u'long_name': u'ABC XYZX',
      u'name': u'XYZX',
      u'new_organisation_type': 70,
      u'organisation_type': u'C',
      u'primary_location': 2,
      u'public_iati_file': True,
      u'url': u'http://moregooddeeds.example.com/'},
     ('Organisation.objects.count()',
      'list(Organisation.objects.order_by("id").values_list("name", flat=True))',),),

    ('/rest/v1/organisation/?format=json&dedup=no_content_owner',
     {u'allow_edit': True,
      u'can_become_reporting': False,
      u'can_create_projects': True,
      u'currency': u'EUR',
      u'language': u'en',
      u'long_name': u'ABC XYZX',
      u'name': u'XYZX',
      u'new_organisation_type': 70,
      u'organisation_type': u'C',
      u'primary_location': 2,
      u'public_iati_file': True,
      u'url': u'http://moregooddeeds.example.com/'},
     ('Organisation.objects.count()',
      'list(Organisation.objects.order_by("id").values_list("name", flat=True))',),),

    ('/rest/v1/organisation/?format=xml',
     ORGANISATION_XML.strip(),
     ('Organisation.objects.count()',),),

    # akvo/rsr/static/scripts-src/my-user-management.js
    ('/rest/v1/invite_user/?format=json',
     {'user_data': '{"organisation": 1, "group": 2, "email": "abc@example.com"}'},
     ('User.objects.count()',),),

    ('/rest/v1/employment/14/approve/?format=json',
     {}, ('Employment.objects.filter(is_approved=True).count()',)),

    ('/rest/v1/employment/14/set_group/2/?format=json',
     {}, ('Employment.objects.filter(group_id=2).count()',)),

    # # akvo/rsr/static/scripts-src/my-results.js
    ('/rest/v1/indicator_period_data/1/upload_file/?format=json',
     {'file': open(join(dirname(HERE), 'iati_export', 'test_image.jpg')),
      'type': 'photo',
      'content_type': None},
     (),),

    ('/rest/v1/indicator_period_data_comment/?format=json',
     {"data": 4, "user": 1, "comment": "My awesome comment"},
     ('IndicatorPeriodDataComment.objects.count()',),),

    ('/rest/v1/indicator_period_data_framework/?format=json',
     {"period": 1, "user": 1, "data": 1, "period_actual_value": "4", "status": "D"},
     ('IndicatorPeriodData.objects.count()',),),

    # akvo/rsr/static/scripts-src/my-iati.js
    ('/rest/v1/iati_export/?format=json',
     {"reporting_organisation": 1, "user": 1, "version": "2", "projects": [4]},
     ('IatiExport.objects.count()',),),

    # akvo/scripts/cordaid/organisation_upload.py
    ('/rest/v1/internal_organisation_id/?format=json',
     {
         "recording_org": 1,
         "referenced_org": 1,
         "identifier": "ABC"},
     ('InternalOrganisationID.objects.count()',),),

    # RSR UP urls ################

    # android/AkvoRSR/src/org/akvo/rsr/up/service/SubmitProjectUpdateService.java
    ('/rest/v1/project_update/?format=xml',
     PROJECT_UPDATE_XML.strip(),
     (),),

    # # android/AkvoRSR/src/org/akvo/rsr/up/service/SubmitEmploymentService.java
    ('/rest/v1/user/1/request_organisation/?format=json',
     {'organisation': 2, 'group': 5, 'country': u'NL', 'job_title': u'User'},
     ('Employment.objects.filter(user_id=2).count()',)),

    # Missing URLs from frequency data
    ('/rest/v1/partnership/?format=json',
     {'organisation': 1, 'project': 4, },
     ('Partnership.objects.count()',)),

    ('/rest/v1/project/?format=json',
     {
         'publishing_status': u'unpublished',
         'title': u'Our amazing project',
         'status': u'N',
         'aggregate_children': True,
         'aggregate_to_parent': True,
         'is_impact_project': True,
         'is_public': True,
         'currency': u'EUR',
         'validations': [1]},
     ('Project.objects.count()',)),

    ('/rest/v1/project/4/add_validation/2/?format=json',
     {},
     ('Project.objects.get(id=4).validations.count()',)),

    ('/rest/v1/user/1/update_details/?format=json',
     {'first_name': 'Angela', 'last_name': 'K'},
     ('User.objects.get(id=1).first_name', 'User.objects.get(id=1).last_name',)),

    ('/rest/v1/user/1/change_password/?format=json',
     {'old_password': 'password',
      'new_password1': 'my-awesome-new-password',
      'new_password2': 'my-awesome-new-password'},
     ('User.objects.get(id=1).check_password("my-awesome-new-password")',)),

    ('/rest/v1/project/4/log_project_addition/?format=json',
     {},
     ('LogEntry.objects.count()',)),

    ('/rest/v1/project_custom_field/?format=json',
     {'project': 4, 'section': 2, 'order': 1, 'type': u'text', 'name': 'wow factor'},
     ('ProjectCustomField.objects.count()',))
]

PATCH_URLS = [
    # akvo/rsr/static/scripts-src/project-editor.jsx
    # '/rest/v1/project/{project_id}/?format=json',
    # '/rest/v1/project_document/{documentId}/?format=json',
    # '/rest/v1/publishing_status/{publishing_status_id}/?format=json',

    # akvo/rsr/static/scripts-src/my-results.js
    # "/rest/v1/indicator_period_data_framework/{update}/?format=json",

    ('/rest/v1/indicator_period_framework/6/?format=json',
     {"locked": True},
     ('IndicatorPeriod.objects.filter(locked=True).count()',)),

    ('/rest/v1/indicator_period_framework/6/?format=json&unlock',
     {"locked": False},
     ('IndicatorPeriod.objects.filter(locked=False).count()',),)


    # akvo/rsr/static/scripts-src/my-iati.js
    # "/rest/v1/iati_export/{iati_export}/?format=json",
    # "/rest/v1/organisation/{{ selected_org.id }}/?format=json",
]


DELETE_URLS = [

    # akvo/rsr/static/scripts-src/my-details-employments.jsx
    ('/rest/v1/employment/1/?format=json',
     {},
     ('Employment.objects.count()', )),


    # akvo/rsr/static/scripts-src/project-editor.jsx
    ('/rest/v1/project/4/remove_validation/1/?format=json', {},
     ('Project.objects.get(id=4).validations.count()',)),

    ('/rest/v1/project/4/remove_keyword/1/?format=json', {},
     ('Project.objects.get(id=4).keywords.count()',)),

    # '/rest/v1/{itemType}/{itemId}/?format=json',

    # # akvo/rsr/static/scripts-src/my-updates.js
    # '/rest/v1/project_update/{update_id}/?format=json',

    # # akvo/rsr/static/scripts-src/my-results.js
    # "/rest/v1/indicator_period_data_framework/{update}/?format=json",
]
