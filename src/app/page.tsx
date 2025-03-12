import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main>
      <div className="record" id="rec584574817">
        <div className="t-cover" id="recorddiv584574817" style={{height: "100vh", backgroundColor: "#ffffff"}}>
          <div className="t-cover__carrier" id="coverCarry584574817" data-content-cover-id="584574817" style={{height: "100vh", backgroundImage: "url('https://static.tildacdn.com/tild6431-6536-4061-b833-376332306536/-/resize/20x/noroot.png')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
          <div className="t-cover__filter" style={{height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.50)"}}></div>
          <div className="t-container">
            <div className="t-col t-col_12">
              <div className="t-cover__wrapper t-valign_middle" style={{height: "100vh"}}>
                <div className="t-cover__container" style={{height: "auto"}}>
                  <div className="t-cover__inner-wrapper">
                    <div className="t-cover__content">
                      <div className="t-container">
                        <div className="t-cover__wrapper t-valign_middle">
                          <div className="t-col t-col_8 t-prefix_2 t-align_center">
                            <div className="t-title t-title_xxs" style={{color: "#ffffff"}}>
                              <h1 className="text-6xl font-bold mb-8">IBRIPEDIA</h1>
                            </div>
                            <div className="t-descr t-descr_xl" style={{color: "#ffffff"}}>
                              <p className="text-xl mb-12">Энциклопедия для сообщества ролевых игр</p>
                            </div>
                            <div className="t-btnwrapper">
                              <div className="flex justify-center gap-6">
                                <Link href="/articles">
                                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                                    Читать статьи
                                  </Button>
                                </Link>
                                <Link href="/discussions">
                                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    Обсуждения
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 