import { Component } from '@angular/core';

@Component({
    selector: 'app-about-me',
    template: `
        <br />
        <br />
        <br />
        <h1 class="my_font">About Me</h1>
        <hr />
        <br />
        <div class="row">
            <div class="col-sm-8">
                <h4 style="padding: 10px;" class="my_second_font">
                    {{ aboutMeBlurb }}
                </h4>
                <br />
                <div class="row">
                    <div class="col-sm-6" style="min-width:250px;">
                        <h3 style="padding: 10px;" class="my_second_font">
                            Contact Me
                        </h3>
                        <h4 style="padding-left: 10px;" class="my_second_font">
                            camden.i.wagner@ivarcode.net
                        </h4>
                        <h4 style="padding-left: 10px;" class="my_second_font">
                            cell: (610) 999 0946
                        </h4>
                        <h4 style="padding-left: 10px;" class="my_second_font">
                            <a href="../assets/Resume.pdf" download
                                >Download Resume</a
                            >
                        </h4>
                    </div>
                    <div class="col-sm-6">
                        <h3 style="padding: 10px;" class="my_second_font">
                            Links
                        </h3>
                        <h4
                            id="social-links"
                            style="padding-left: 10px; min-width:250px;"
                            class="my_second_font"
                        >
                            <a href="https://github.com/ivarcode" alt="GitHub"
                                ><img
                                    width="48"
                                    height="48"
                                    src="../assets/img/github.png"
                            /></a>
                            <a
                                href="https://www.linkedin.com/in/camdeniwagner"
                                alt="LinkedIn"
                                ><img
                                    width="48"
                                    height="48"
                                    src="../assets/img/1471913197_linkedin.png"
                            /></a>
                            <a
                                href="https://www.facebook.com/camden.i.wagner"
                                alt="Facebook"
                                ><img
                                    width="48"
                                    height="48"
                                    src="../assets/img/1471913192_facebook.png"
                            /></a>
                        </h4>
                        <br />
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <img
                    src="../assets/img/cwagner_hs.png"
                    style="padding:10px;width:100%;"
                />
            </div>
        </div>
        <br />
    `
})
export class AboutMeComponent {
    aboutMeBlurb = `My name is Camden Wagner and I am a computer science major
    / philosophy minor at Connecticut College graduating in May of 2020.  I
    have been programming since I was very young and have experience working in
    IT with hardware as well.  I interned at Miles Technologies in Lumberton, NJ
    this summer and worked with a team of intern developers and leaders at the
    company to create and publish an angular package.  I will be looking for a
    software developer job in the coming months prior to graduating; please
    contact me if you have interest in working together.  More details and
    information can be found with my resume, below.`;
}
