
    function readURL(img) {
        if(img.files && img.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#stuff').attr('src', e.target.result);
            }

            reader.readAsDataURL(img.files[0]);
        }
    }

    $('#img').change(function() {
        readURL(this);
    });