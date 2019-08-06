
    function readURL(inputGroupFile01) {
        if(inputGroupFile01.files && inputGroupFile01.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#stuff').attr('src', e.target.result);
            }

            reader.readAsDataURL(inputGroupFile01.files[0]);
        }
    }

    $('#inputGroupFile01').change(function() {
        readURL(this);
        console.log(this.value);
        var fname = this.value.substring(12, this.value.length);
        $('#inputGroupFile01').siblings().html(fname)
    });